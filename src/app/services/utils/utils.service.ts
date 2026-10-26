import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare var echarts: any;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  getFormValidationErrors(
    form: FormGroup
  ): string {
    let messages: string[] = [];

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              messages.push(`${this.getFieldLabel(key)} é obrigatório.`);
              break;
            case 'minlength':
              const requiredLength = controlErrors['minlength'].requiredLength;
              messages.push(`${this.getFieldLabel(key)} deve ter pelo menos ${requiredLength} caracteres.`);
              break;
            default:
              messages.push(`${this.getFieldLabel(key)} inválido.`);
          }
        });
      }
    });

    return messages.join('\n');
  }

  getFieldLabel(
    fieldName: string
  ): string {
    const labels: any = {
      name: 'Nome',
      column: 'Coluna'
    };
    return labels[fieldName] || fieldName;
  }

  showAutoCloseMessage(
    msg: string,
    color: string,
    duration = 1000
  ) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.backgroundColor = color;
    div.style.color = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '4px';
    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, duration);

  }

  /**
   * Trata resposta padronizada do backend
   * @param response Resposta do backend no formato { success: boolean, data?: any, message?: string }
   * @returns O data se success=true, ou lança erro se success=false
   */
  handleApiResponse(response: any): any {
    if (response && response.success === true) {
      return response.data;
    } else if (response && response.success === false) {
      const errorMessage = response.message || 'Erro na operação';
      throw new Error(errorMessage);
    } else {
      // Resposta não padronizada (compatibilidade)
      return response;
    }
  }

  /**
   * Trata erro de API e mostra mensagem ao usuário
   * @param error Erro capturado
   * @param defaultMessage Mensagem padrão se não houver mensagem específica
   */
  handleApiError(error: any, defaultMessage: string = 'Ocorreu um erro inesperado.') {
    let message = defaultMessage;

    if (error && error.message) {
      message = error.message;
    } else if (error && error.error && error.error.message) {
      message = error.error.message;
    }

    console.error('Erro na API:', error);
    this.showAutoCloseMessage(message, 'red', 5000);
  }

  /**
   * Cria ou atualiza um gráfico usando Apache ECharts
   *
   * Vantagens desta implementação:
   * - Reutiliza instância do gráfico (evita memory leak)
   * - Responsivo com ResizeObserver
   * - Código mais performático
   * - Suporta bar, pie e doughnut
   * - Formatação de moeda centralizada
   */
  createChart(
    id: string,
    params: {
      type: 'bar' | 'pie' | 'doughnut' // tipos suportados
      labels: string[]                 // nomes das categorias
      values: number[]                 // valores do gráfico
      colors?: string[]                // cores opcionais
      orientation?: 'horizontal' | 'vertical' // direção da barra
    }
  ) {

    if (params.values.length > 0
      && (!params.colors || !params.colors.length)) {
      params.colors = [];
      
      const step = 360 / params.values.length;
      for (let i = 0; i < params.values.length; i++) {
        const hue = i * step;
        params.colors.push(`hsl(${hue}, 70%, 50%)`);
      }
    }

    // ===============================
    // Buscar container do gráfico
    // ===============================
    const container = document.getElementById(id);

    // se não existir, evita erro
    if (!container) return;

    // ===============================
    // Reutilizar instância existente
    // ===============================
    // evita criar múltiplos gráficos no mesmo DOM
    let chart = echarts.getInstanceByDom(container);

    if (!chart) {
      chart = echarts.init(container);
    }

    // ===============================
    // Helpers (funções auxiliares)
    // ===============================

    // formatação de moeda reutilizável
    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const formatCurrency = (value: number) =>
      currencyFormatter.format(value);

    // Chart canvas colors are resolved from the active theme's CSS tokens.
    const themeColor = (token: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim();

    // verifica tipo de gráfico
    const isBar = params.type === 'bar';
    const isPie = params.type === 'pie' || params.type === 'doughnut';

    // ===============================
    // Preparação dos dados
    // ===============================

    /**
     * Estrutura de dados diferente para cada tipo
     * - pie/doughnut → name + value
     * - bar → value + style opcional
     */

    const data = isPie
      ? params.labels.map((label, i) => ({
        name: label,
        value: params.values[i]
      }))
      : params.values.map((value, i) => ({
        value,
        itemStyle: {
          color: params.colors?.[i] // usa cor se existir
        }
      }));

    // ===============================
    // Configuração base do gráfico
    // ===============================

    const option: any = {

      // cores padrão do gráfico
      // color: params.colors,

      // tooltip ao passar o mouse
      tooltip: {
        trigger: 'item',
        backgroundColor: themeColor('--ui-bg-surface'),
        borderColor: 'var(--ui-border-strong)',
        textStyle: { color: themeColor('--ui-text-primary') },
        formatter: (p: any) =>
          `${p.name ?? ''} ${formatCurrency(p.value)}`
      },

      // legenda apenas para pizza
      legend: isPie
        ? {
          bottom: 0,
          textStyle: { color: themeColor('--ui-text-primary') }
        }
        : undefined,

      textStyle: { color: themeColor('--ui-text-primary') },

      // animação suave
      animationDuration: 700,

      // séries do gráfico
      series: []
    };

    // ===============================
    // Configuração para gráfico BAR
    // ===============================

    if (isBar) {

      // margem interna do gráfico
      option.grid = {
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true
      };

      // eixo X
      option.xAxis = {
        type: params.orientation === 'vertical'
          ? 'category'
          : 'value',

        data: params.orientation === 'vertical' ? params.labels : undefined,
        axisLabel: { color: themeColor('--ui-text-muted') },
        axisLine: { lineStyle: { color: themeColor('--ui-border-strong') } },
        splitLine: { lineStyle: { color: 'var(--ui-border)' } }
      };

      // eixo Y
      option.yAxis = {
        type: params.orientation === 'vertical'
          ? 'value'
          : 'category',

        data: params.orientation === 'horizontal' ? params.labels : undefined,
        axisLabel: { color: themeColor('--ui-text-muted') },
        axisLine: { lineStyle: { color: themeColor('--ui-border-strong') } },
        splitLine: { lineStyle: { color: 'var(--ui-border)' } }
      };

      // série de barras
      option.series = [{
        type: 'bar',
        data,

        // largura da barra
        barWidth: '50%',

        // label acima da barra
        label: {
          show: true,
          position: 'insideRight',
          color: 'var(--ui-text-strong)',
          // position: params.orientation === 'vertical'
            // ? 'top'
            // : 'right',

          formatter: (p: any) =>
            formatCurrency(p.value)
        }
      }];
    }

    // ===============================
    // 7️⃣ Configuração para PIE / DOUGHNUT
    // ===============================

    if (isPie) {

      option.series = [{
        type: 'pie',

        // doughnut ou pizza
        radius: params.type === 'doughnut'
          ? ['45%', '70%']
          : '70%',

        center: ['50%', '45%'],

        data,

        label: {
          color: 'var(--ui-text-strong)',
          formatter: (p: any) =>
            `${p.name}\n${formatCurrency(p.value)}`
        }
      }];
    }

    // ===============================
    // Aplicar configuração no gráfico
    // ===============================
    chart.setOption(option);

    // ===============================
    // Responsividade automática
    // ===============================

    /**
     * ResizeObserver detecta mudanças
     * no tamanho do container
     */
    const resizeObserver = new ResizeObserver(() => {
      chart!.resize();
    });

    resizeObserver.observe(container);
  }
}
