import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styles: []
})
export class AddEventComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @ViewChild('lieuInput', { static: false }) lieuInput!: ElementRef;

  submitted = false;
  eventFile: any;
  imgURL: any;
  title: string = '';
  suggestions: string[] = [];

  constructor(
    public service: EventService,
    public fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    public datePipe: DatePipe,
    private http: HttpClient
  ) {}

  get f() {
    return this.service.formData.controls;
  }

  ngOnInit(): void {
    const current = this.service.formData?.value;
  
    this.initForm(this.service.choixmenu === 'M' ? current : undefined);
  
    this.title = this.service.choixmenu === 'A'
      ? 'Ajouter un événement'
      : 'Modifier un événement';
  
    if (this.service.choixmenu === 'M' && current.idEvenement) {
      this.imgURL = `http://localhost:8081/PIdev/api/events/images/${current.idEvenement}`;
    }
  }
  
  initForm(item?: any): void {
    this.service.formData = this.fb.group({
      idEvenement: [item?.idEvenement ?? null],
      titre: [item?.titre ?? '', [Validators.required, Validators.minLength(3)]],
      description: [item?.description ?? '', [Validators.required, Validators.minLength(10)]],
      dateEvenement: [item?.dateEvenement ?? '', [Validators.required]],
      dateFin: [item?.dateFin ?? '', [Validators.required]],
      lieu: [item?.lieu ?? '', [Validators.required]],
      capaciteMax: [item?.capaciteMax ?? null, [Validators.required, Validators.min(1)]],
      typeEvenement: [item?.typeEvenement ?? '', Validators.required]
    }, {
      validators: this.validateDates.bind(this)
    });
  
    this.service.formData.get('lieu')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        if (value.length >= 2) {
          this.searchSuggestions(value);
        } else {
          this.suggestions = [];
        }
      });
  }
  

  searchSuggestions(query: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    this.http.get<any[]>(url).subscribe(data => {
      this.suggestions = data.map(item => item.display_name);
    });
  }

  selectSuggestion(value: string): void {
    this.service.formData.get('lieu')?.setValue(value);
    this.suggestions = [];
  }

  dateInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value);
    return inputDate < today ? { pastDate: true } : null;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.service.formData.invalid) {
      this.toastr.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (this.service.choixmenu === 'A') {
      this.addData();
    } else {
      this.updateData();
    }
  }

  addData(): void {
    const rawForm = this.service.formData.value;
    const dateEvenement = new Date(rawForm.dateEvenement);
const dateFin = new Date(rawForm.dateFin);
  
    const event = {
      ...rawForm,
      typeEvenement: rawForm.typeEvenement.toUpperCase(),
      dateEvenement: rawForm.dateEvenement,
  dateFin: rawForm.dateFin

    };
    
    this.service.createData(event, this.eventFile).subscribe({
      next: () => {
        this.toastr.success('Événement ajouté avec succès');
        this.onClose.emit();
        this.service.getAll().subscribe(res => (this.service.list = res));
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Erreur lors de l'ajout de l'événement");
      }
    });
  }

  updateData(): void {
  const rawForm = this.service.formData.value;
  const dateEvenement = new Date(rawForm.dateEvenement);
  const dateFin = new Date(rawForm.dateFin);
  const event = {
    ...rawForm,
    typeEvenement: rawForm.typeEvenement.toUpperCase(),
    dateEvenement: rawForm.dateEvenement,
  dateFin: rawForm.dateFin
  };

  this.service.updateDataWithFile(event, this.eventFile).subscribe({
    next: () => {
      this.toastr.success('Événement modifié avec succès');
      this.onClose.emit();
      this.service.getAll().subscribe(res => (this.service.list = res));
    },
    error: (err) => {
      console.error(err);
      this.toastr.error("Erreur lors de la mise à jour de l'événement");
    }
  });
}


  onSelectFile(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.eventFile = file;

      const mimeType = file.type;
      if (!mimeType.startsWith('image/')) {
        this.toastr.error('Seules les images sont autorisées.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imgURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.onClose.emit();
  }
  validateDates(group: AbstractControl): ValidationErrors | null {
    const dateDebut = new Date(group.get('dateEvenement')?.value);
    const dateFin = new Date(group.get('dateFin')?.value);
    const now = new Date();
  
    // Vérifie si la date de début est dans le passé
    if (dateDebut < now) {
      group.get('dateEvenement')?.setErrors({ pastDate: true });
      return { pastDate: true };
    }
  
    // Vérifie si la date de fin est avant ou égale à la date de début
    if (dateFin <= dateDebut) {
      group.get('dateFin')?.setErrors({ endBeforeStart: true });
      return { endBeforeStart: true };
    }
  
    return null;
  }
  
}
