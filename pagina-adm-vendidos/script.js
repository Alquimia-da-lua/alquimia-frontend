class MeuComponente extends HTMLElement {
  constructor() {
    super();
    // Opcional: Anexar um Shadow DOM para encapsulamento
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <div class="janelao"></div>
    `;
  }
}

customElements.define('meu-componente', MeuComponente);