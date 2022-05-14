function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateDistinctRandomPositions(number, x, y) {
  let positions = new Array();

  if (typeof x != 'number') {
    throw new Error('Indique um valor numérico para o eixo X.');
  }
  if (x <= 0) {
    throw new Error('O número de eixo X deve ser positivo.');
  }

  if (typeof y != 'number') {
    throw new Error('Indique um valor numérico para o eixo Y.');
  }
  if (y <= 0) {
    throw new Error('O número de eixo Y deve ser positivo.');
  }

  if (typeof number != 'number') {
    throw new Error('Indique um valor numérico de posições.');
  }
  if (number <= 0) {
    throw new Error('O número de posições deve ser positivo.');
  }

  if (number > x * y) {
    throw new Error(`O número de ${number} posições, é maior que o permitido: ${x * y}.`);
  }

  for (let i = 0; i < number; i++) {
    let position = {
      x: randomIntFromInterval(0, x-1),
      y: randomIntFromInterval(0, y-1)
    };
    let j = 0;

    while(j < positions.length) {
      if (positions[j].x == position.x && positions[j].y == position.y) {
        position = {
          x: randomIntFromInterval(0, x),
          y: randomIntFromInterval(0, y)
        };
        j = 0;
      } else {
        j++;
      }
    }

    positions.push(position);
  }

  return positions;
}
