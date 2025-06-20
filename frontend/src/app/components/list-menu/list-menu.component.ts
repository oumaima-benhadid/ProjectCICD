import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { AnimationOptions } from "ngx-lottie";

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.css']
})
export class ListMenuComponent implements OnInit {
  menus: any[] = [];
  displayedMenus: any[] = [];
  menuCount = 3; // Number of menus to display initially
  visiblePlatCount: { [key: number]: number } = {}; // To track visible plats for each menu
  currentUserId = 1;
  favoriteMenuId: number | null = null;
  editingComment: any = null;
  currentCommentId: number = 0;
  searchQuery: string = '';
  searchTimeout: any = null;
  lottieOptions: AnimationOptions = {
    path: '/assets/no_data.json',
    loop: true,
    autoplay: true
  };

  constructor(private menuService: MenuService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadMenus();
    const savedFavorite = localStorage.getItem('favoriteMenuId');
    if (savedFavorite) {
      this.favoriteMenuId = parseInt(savedFavorite, 10);
    }
  }

  loadMenus(): void {
    this.menuService.getConfirmedMenus().subscribe({
      next: (data) => {
        this.menus = data;
        this.initializeMenus(this.menus);
        this.loadMoreMenus();
      },
      error: (err) => console.error('Error loading menus', err)
    });
  }

  initializeMenus(menus: any[]): void {
    menus.forEach(menu => {
      menu.showCommentBox = false;
      menu.comments = [];
      menu.liked = false;
      menu.disliked = false;
      menu.likesCount = 0;
      menu.dislikesCount = 0;
      menu.newComment = '';

      this.loadMenuComments(menu.idMenu);
    });
  }
  loadMenuComments(menuId: number): void {
    this.menuService.getCommentsByMenuId(menuId).subscribe({
      next: (comments) => {
        const menu = this.menus.find(m => m.idMenu === menuId);
        if (menu) {
          menu.comments = comments.map(c => ({
            ...c,
            dateCommentaire: new Date(c.createdAt)
          }));
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading comments', err)
    });
  }
  trackByMenuId(index: number, menu: any): number {
    return menu.idMenu;
  }

  loadMoreMenus(): void {
    const nextMenus = this.menus.slice(this.displayedMenus.length, this.displayedMenus.length + this.menuCount);
    this.displayedMenus.push(...nextMenus);

    // Initialize the visible plat count for each new menu
    nextMenus.forEach(menu => {
      if (!this.visiblePlatCount[menu.idMenu]) {
        this.visiblePlatCount[menu.idMenu] = 1;
      }
    });
  }

  loadMorePlats(menuId: number): void {
    const menu = this.menus.find(m => m.idMenu === menuId);
    if (menu && this.visiblePlatCount[menuId] < menu.plats.length) {
      this.visiblePlatCount[menuId] += 1;
    }
  }

  getVisiblePlats(menu: any): any[] {
    return menu.plats.slice(0, this.visiblePlatCount[menu.idMenu]);
  }

  toggleCommentBox(menuId: number): void {
    const menu = this.menus.find(m => m.idMenu === menuId);
    if (menu) {
      menu.showCommentBox = !menu.showCommentBox;
    }
  }

  toggleLikeDislike(menuId: number, userId: number): void {
    const menu = this.menus.find(m => m.idMenu === menuId);
    if (menu) {
      // Determine new state
      if (menu.liked) {
        // Currently liked - switch to disliked
        menu.likesCount--;
        menu.liked = false;
        menu.dislikesCount++;
        menu.disliked = true;
      } else if (menu.disliked) {
        // Currently disliked - remove rating
        menu.dislikesCount--;
        menu.disliked = false;
      } else {
        // Not rated - like it
        menu.likesCount++;
        menu.liked = true;
      }

      // Update backend
      const action = menu.liked ? 'LIKE' : menu.disliked ? 'DISLIKE' : 'NONE';
      this.menuService.toggleLikeDislike(menuId, userId, action).subscribe({
        next: (response) => {
          console.log('Like/Dislike updated', response);
        },
        error: (error) => {
          console.error('Error updating like/dislike', error);
          // Revert changes if error
          if (action === 'LIKE') {
            menu.likesCount--;
            menu.liked = false;
          } else if (action === 'DISLIKE') {
            menu.dislikesCount--;
            menu.disliked = false;
          }
        }
      });
    }
  }

  addComment(menuId: number, userId: number, commentText: string): void {
    if (!commentText?.trim()) return;

    const menu = this.menus.find(m => m.idMenu === menuId);
    if (menu) {
      this.menuService.addComment(menuId, userId, commentText).subscribe({
        next: (comment) => {
          menu.comments.unshift(comment); // Add new comment at beginning
          menu.newComment = ''; // Clear input
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error adding comment', error);
        }
      });
    }
  }

  editComment(comment: any): void {
    this.editingComment = { ...comment };
    this.currentCommentId = comment.id;
  }

  saveEditedComment(): void {
    if (this.editingComment) {
      this.menuService.updateComment(this.editingComment).subscribe({
        next: (updatedComment) => {
          const menu = this.menus.find(m => m.idMenu === updatedComment.menu.idMenu);
          if (menu) {
            const index = menu.comments.findIndex((c: any) => c.id === updatedComment.id);
            if (index !== -1) {
              menu.comments[index] = updatedComment;
            }
          }
          this.editingComment = null;
          this.currentCommentId = 0;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error updating comment', error);
        }
      });
    }
  }

  deleteComment(menuId: number, commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.menuService.deleteComment(menuId, commentId).subscribe({
        next: () => {
          const menu = this.menus.find(m => m.idMenu === menuId);
          if (menu) {
            menu.comments = menu.comments.filter((c: any) => c.id !== commentId);
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error deleting comment', error);
        }
      });
    }
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.searchQuery.trim()) {
        this.menuService.searchMenus(this.searchQuery).subscribe({
          next: (data) => {
            this.menus = data;
            this.displayedMenus = [];
            this.visiblePlatCount = {};
            
            if (this.menus.length > 0) {
              this.initializeMenus(this.menus);
              this.loadMoreMenus();
            }
            
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Search error', error);
          }
        });
      } else {
        this.loadMenus();
      }
    }, 300);
  }

  toggleFavorite(menuId: number): void {
    if (this.favoriteMenuId === menuId) {
      this.favoriteMenuId = null;
      localStorage.removeItem('favoriteMenuId');
    } else {
      this.favoriteMenuId = menuId;
      localStorage.setItem('favoriteMenuId', menuId.toString());
    }
    this.cdr.detectChanges();
  }
}