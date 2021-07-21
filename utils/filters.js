String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), (ignore ? 'gi' : 'g')), (typeof (str2) === 'string') ? str2.replace(/\$/g, '$$$$') : str2)
}

export default function listaFiltrada (lista, search, param1, param2) {
  return lista.filter((item) => {
    const tittles = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'
    const original = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc'
    let cleanSearch = search
    let cleanItemParam1 = item[param1]
    let cleanItemParam2 = item[param2]

    for (let i = 0; i < tittles.length; i++) {
      cleanSearch = cleanSearch.replaceAll(tittles.charAt(i), original.charAt(i)).toLowerCase()
      cleanItemParam1 = cleanItemParam1.replaceAll(tittles.charAt(i), original.charAt(i)).toLowerCase()
      cleanItemParam2 = cleanItemParam2.replaceAll(tittles.charAt(i), original.charAt(i)).toLowerCase()
    }
    return (cleanItemParam1 + ' ' + cleanItemParam2).includes(cleanSearch)
  })
}

function listaFiltradaParams (lista, search, ...params) {
  return lista.filter((item) => {
    const tittles = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç'
    const original = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc'
    let cleanSearch = search
    const cleanItems = []
    for (let i = 0; i < params.length; i++) {
      cleanItems[i] = item[params[i]]
    }
    for (let i = 0; i < tittles.length; i++) {
      cleanSearch = cleanSearch.replace(tittles.charAt(i), original.charAt(i)).toLowerCase()
      for (let j = 0; j < cleanItems.length; j++) {
        cleanItems[j] = cleanItems[j].replace(tittles.charAt(i), original.charAt(i)).toLowerCase()
      }
    }
    return cleanItems.join(' ').includes(cleanSearch)
  })
}

export const handleError = (error) => {
  const errorStatus = error ? error.status : error
  const errorMessage = prepareErrorMessage(errorStatus)
  return errorMessage
}

const prepareErrorMessage = (status) => {
  switch (status) {
    case 401:
      return 'Credenciales inválidas'
    case 422:
      return 'Unprosomething entity'
    case 404:
      return "You're lost"
    case 405:
      return 'Read the manual'
    case 500:
      return 'No se ha encontrado información sobre su código'
    default:
      return 'Error, please try again later'
  }
}

export const updateLocalUsuario = function (usuario) {
  localStorage.setItem('userData', JSON.stringify(usuario))
}
