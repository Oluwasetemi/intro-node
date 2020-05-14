function generateCode(num = 7) {
  let text = '';
  const possible =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';

  for (let i = 0; i < num; i += 1) {
    const randomInteger = Math.floor(Math.random() * possible.length);
    text += possible.charAt(randomInteger);
  }

  return text;
}

module.exports = generateCode;
