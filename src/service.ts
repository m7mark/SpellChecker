import axios, { AxiosResponse } from 'axios';

class SpellChecker {
  async sendChankText(textPart: string) {
    let tempText = ''
    const arrChunkText = [] as Array<String>

    //changing wrong words
    const newText = (resp: Array<Object>, text: string) => {
      tempText = text
      resp.forEach((elem: any) => {
        tempText = tempText.replace(
          elem['word'],
          elem['s'][0] || elem['word']
        )
      })
      arrChunkText.push(tempText)
    }
    // post req to Ya speller
    if (textPart.length) {
      try {
        let resp: AxiosResponse<Array<Object>> = await axios.post(`http://speller.yandex.net/services/spellservice.json/checkText?text=${encodeURI(textPart)}`)
        newText(resp.data, textPart)
      } catch (e) {
        console.log('Yandex error');
      }
    }
    return arrChunkText
  }
}

export default new SpellChecker