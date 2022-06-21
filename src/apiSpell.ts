import FormData from 'form-data'
import fetch from 'node-fetch'

export const apiSpell = async (textPart: string) => {
  let tempText = ''
  let formData = new FormData()
  formData.append('text', textPart)

  //changing wrong words
  const newText = (spellPositionArray: Array<Object>, text: string) => {
    tempText = text
    spellPositionArray.forEach((elem: any) => {
      tempText = tempText.replace(elem['word'], elem['s'][0] || elem['word'])
    })
  }
  // post req to Yansex speller
  if (textPart.length) {
    try {
      let response = await fetch(
        'https://speller.yandex.net/services/spellservice.json/checkText',
        { method: 'POST', body: formData }
      )
      const spellPositionArray = (await response.json()) as Array<Object>
      newText(spellPositionArray, textPart)
    } catch (e) {
      console.log('Yandex error: ' + e)
    }
  }
  return tempText
}
