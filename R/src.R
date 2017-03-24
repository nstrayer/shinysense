#In order to load the javascript and css we can first load it to a character var
.get_script <- function(title, type){
  fileName <- system.file(type, title, package = "shinysense")
  readChar(fileName, file.info(fileName)$size)
}
