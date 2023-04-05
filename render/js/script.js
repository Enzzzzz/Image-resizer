const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightImput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

//DISCORD PRESET
function discordPreset(e) {
  const discord = e.target.files[0]

}

function loadImage(e) {
  const file = e.target.files[0]

  if(!isFileImage(file)) {
    alertError('Selecione uma Imagem (Gif, PNG, JPEG).')
    return
  } else {
    alertSuccess('Escolha as dimensões da imagem abaixo!')
  }

  //GET ORIGINAL DIMENSIONS
  const image = new Image()
  image.src = URL.createObjectURL(file)
  image.onload = function () {
    widthInput.value = this.width
    heightImput.value = this.height
  }

  form.style.display = 'block'
  filename.innerText = file.name
  outputPath.innerText = path.join(os.homedir(), 'YulbotResizer')
}

//SEND IMAGE
function sendImage(e) {
  e.preventDefault()

  const width = widthInput.value
  const height = heightImput.value
  const imgPath = img.files[0].path

  if(!img.files[0]) {
    alertError('Selecione uma Imagem (Gif, PNG, JPEG).')
    return
  }

  if(width === '' || height === '') {
    alertError('Por favor, preencha os campos abaixo!')
  }

  //send to main (ipcRenderer)
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  })
}

// IMAGE:DONE EVENT
ipcRenderer.on('image:done', () => {
  alertSuccess(`Imagem redimensionada para ${widthInput.value}x${heightImput.value}`)
})

//Check file type
function  isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg']
  return file && acceptedImageTypes.includes(file['type'])
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center'

    }
  })
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center'

    }
  })
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)