// Wait till Socket.io is laoded to window
window.onload = function() {
  // service
  const socket = io.connect('http://localhost:8080')

  // Styling
  const chatStyle = 'color: #800080; font-size:15px; font-family: helvetica;'
  const archStyle = 'color: #a694a6; font-size:15px; font-family: helvetica;'
  const sysStyle = 'color: #ccc; font-size:12px; font-family: helvetica;'

  // Storage
  const messageQueue = []

  // Console painting system
  function addMessage(message) {
    messageQueue.push(message)

    // Clear current console and
    // output messages in queue
    console.clear()
    messageQueue.forEach(messageObj => {
      const { message, style } = messageObj
      console.log('%c' + message, style)
    })
  }

  // Function for sending messages
  // directly from the console
  function consoleMessage(message) {
    socket.emit('send', message)
  }

  // Function to call alert pop up
  // with text input
  function alertMessage() {
    const message = prompt('enter your message')
    socket.emit('send', message)
  }

  // Bind functions to appropriate objects
  window.msg = consoleMessage
  msg.toString = alertMessage

  // Event handlers
  socket.on('message', message => addMessage({ message, style: chatStyle }))
  socket.on('sysMessage', message => addMessage({ message, style: sysStyle }))
  socket.on('archMessage', message => addMessage({ message, style: archStyle }))
}
