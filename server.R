## server.R

require(shiny)
library(httr)
library(jsonlite)

shinyServer(function(input, output) {

# GET Request Example
  observeEvent(input$get_btn, {
    # Retrieve API Data for specific clinical trial
    clinical_trial_data <- GET("https://clinicaltrials.gov/api/v2/studies/NCT02076178")
    # Convert Data into Text
    clinical_text <- content(clinical_trial_data,"text", encoding = "UTF-8")
    # Parsing data in JSON
    get_json <- fromJSON(clinical_text, flatten = TRUE)
    output$get_output <- renderText(get_json$protocolSection$designModule$enrollmentInfo$count)
  })

   observeEvent(input$post_btn, {
    # Send POST request to Node.js server for histogram data
    
    ##### POST REQUEST #####
    post_data <- POST(
      url = "https://shiny-a9e90cfe443c.herokuapp.com/histogram-data",
      body = "{}", 
      encode = "json"
    )
    # Parse the received JSON data
    post_json <- fromJSON(content(post_data, "text", encoding = "UTF-8"))
    output$post_output <- renderText(paste("Received from https://shiny-a9e90cfe443c.herokuapp.com/histogram-data: ", toString(post_json)))
  })

output$distPlot <- renderPlot({
    # Fetch data from https://shiny-a9e90cfe443c.herokuapp.com/histogram-data
    data <- fromJSON(content(GET("https://shiny-a9e90cfe443c.herokuapp.com/histogram-data"), "text", encoding = "UTF-8"))
    
    hist(data$values, col = 'darkgray', border = 'white')
  })


})