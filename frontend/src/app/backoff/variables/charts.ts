import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

// ✅ Type string explicite
const mode: string = 'light';
const fonts = { base: 'Open Sans' };

const colors = {
  gray: {
    100: '#f6f9fc',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#8898aa',
    700: '#525f7f',
    800: '#32325d',
    900: '#212529'
  },
  theme: {
    default: '#172b4d',
    primary: '#9b1d1d',
    secondary: '#f4f5f7',
    info: '#11cdef',
    success: '#2dce89',
    danger: '#f5365c',
    warning: '#fb6340'
  },
  black: '#12263F',
  white: '#FFFFFF',
  transparent: 'transparent',
};

// ➕ Tu peux encore utiliser ces fonctions si tu les relies dans des composants

export function chartOptions(): any {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    elements: {
      point: { radius: 0, backgroundColor: colors.theme.primary },
      line: {
        tension: 0.4,
        borderWidth: 4,
        borderColor: colors.theme.primary,
        backgroundColor: colors.transparent,
        borderCapStyle: 'round'
      },
      bar: {
        backgroundColor: colors.theme.warning
      },
      arc: {
        backgroundColor: colors.theme.primary,
        borderColor: mode === 'dark' ? colors.gray[800] : colors.white,
        borderWidth: 4
      }
    }
  };
}

export const parseOptions = (parent: any, options: any): void => {
  for (const item in options) {
    if (typeof options[item] !== 'object') {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
};

export const chartExample1 = {
  options: {
    scales: {
      y: {
        ticks: {
          callback: (value: number) => !(value % 10) ? `$${value}k` : undefined
        },
        grid: {
          drawOnChartArea: false,
          color: colors.gray[900]
        }
      }
    }
  },
  data: {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Performance',
      data: [0, 20, 10, 30, 15, 40, 20, 60]
    }]
  }
};

export const chartExample2 = {
  options: {
    scales: {
      y: {
        ticks: {
          callback: (value: number) => !(value % 10) ? value : undefined
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (item: any) => {
            return `${item.dataset.label || ''}: ${item.raw}`;
          }
        }
      }
    }
  },
  data: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Sales',
      data: [25, 20, 30, 22, 17, 29],
      maxBarThickness: 10
    }]
  }
};
