const cartas = document.querySelectorAll('.cartas-escolha .carta-tarot');
        const containerReveladas = document.getElementById('cartasReveladas');
        const conteudoFinal = document.getElementById('conteudoFinal');
      
        const imagensCartas = [
          'img/card_wheel_of_fortune-v7.png', 'img/card_tower-v7.png', 'img/card-magician-v7.png',
        ];
      
        let cartasEscolhidas = [];
        let cartasRestantes = [...imagensCartas];
      
        cartas.forEach((carta, index) => {
          carta.addEventListener('click', () => {
            if (cartasEscolhidas.length >= 3 || carta.classList.contains('revelada')) return;
      
            // Sorteia uma carta que ainda não foi usada
            const sorteio = cartasRestantes.splice(Math.floor(Math.random() * cartasRestantes.length), 1)[0];
            cartasEscolhidas.push(sorteio);
      
            // Substitui a imagem da carta clicada pela revelada
            carta.src = sorteio;
            carta.classList.add('revelada');
      
            // Clona e adiciona a carta revelada ao container final
            const cartaMostrada = carta.cloneNode(true);
            containerReveladas.appendChild(cartaMostrada);
      
            // Mostra o container das cartas reveladas se ainda estiver oculto
            containerReveladas.classList.remove('oculto');
      
            // Quando completar 3 cartas, oculta as não clicadas e mostra a leitura
            if (cartasEscolhidas.length === 3) {
              cartas.forEach(c => {
                if (!c.classList.contains('revelada')) {
                  c.classList.add('oculto');
                }
              });
      
              setTimeout(() => {
                conteudoFinal.classList.remove('oculto');
              }, 800);
            }
          });
        });