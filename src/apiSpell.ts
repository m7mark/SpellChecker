import FormData from 'form-data';
import fetch from 'node-fetch';

export const apiSpell = async (textPart: string) => {

  let tempText = ''
  const arrChunkText = [] as Array<String>

  let formData = new FormData()
  formData.append('text', textPart);

  //changing wrong words
  const newText = (spellPositionArray: Array<Object>, text: string) => {
    tempText = text
    spellPositionArray.forEach((elem: any) => {
      tempText = tempText.replace(
        elem['word'],
        elem['s'][0] || elem['word']
      )
    })
    arrChunkText.push(tempText)
  }
  // post req to Yansex speller
  if (textPart.length) {
    try {
      let response = await fetch('https://speller.yandex.net/services/spellservice.json/checkText', { method: 'POST', body: formData })
      const spellPositionArray = await response.json();
      newText(spellPositionArray, textPart)
      // formData.destroy()
    } catch (e) {
      console.log('Yandex error: ' + e);
    }
  }
  return arrChunkText
}
