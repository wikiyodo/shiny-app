require(shiny)
library(httr)
library(jsonlite)

shinyServer(function(input, output) {

  # Function to handle changes in filters and fetch data from the API
  getLineChartData <- function() {
    # Extracting input values
    selected_drug <- input$drug
    sample_type <- input$sample_type
    study_population <- input$study_population
    route_of_admin <- input$route_of_admin
    formulation <- input$formulation
    dose_mg <- input$dose_mg
    trimesters <- input$trimesters

    # Creating payload for API request
    payload <- list(
      drug = selected_drug,
      sample_type = sample_type,
      study_population = study_population,
      route_of_admin = route_of_admin,
      formulation = formulation,
      dose_mg = dose_mg,
      trimesters = trimesters
    )

    # Sending POST request to the API endpoint
    api_response <- httr::POST("https://shiny-a9e90cfe443c.herokuapp.com/line-chart-data", body = payload, encode = "json")

    line_chart_data <- fromJSON(content(api_response, "text", encoding = "UTF-8"))
    
    output$lineChart <- renderPlotly({
      p <- plot_ly(as.data.frame(line_chart_data), x = ~x)

      for (trimester_label in names(line_chart_data)) {
        if (trimester_label != "x") {
          field_label <- paste0("~`", trimester_label, "`");
          
          p <- p %>% 
            add_lines(
              y = line_chart_data[[trimester_label]],
              name = trimester_label
            )
        }
      }

      p %>% 
        layout(
          title = "Multi-line Chart",
          xaxis = list(title = "Time After Dose", tickvals = line_chart_data$x, ticktext = line_chart_data$x),
          yaxis = list(title = "Drug concentration (ng/mL)")
        )
    })

  }

  # Observing changes in filter inputs
  observe({
    getLineChartData()
  })

  # GET Request Example
  observeEvent(input$get_btn, {
    # Retrieve API Data for a specific clinical trial
    clinical_trial_data <- GET("https://clinicaltrials.gov/api/v2/studies/NCT02076178")
    # Convert Data into Text
    clinical_text <- content(clinical_trial_data, "text", encoding = "UTF-8")
    # Parsing data in JSON
    get_json <- fromJSON(clinical_text, flatten = TRUE)
    output$get_output <- renderText(get_json$protocolSection$designModule$enrollmentInfo$count)
  })

  # POST Request Example
  observeEvent(input$post_btn, {
    # Send POST request to Node.js server for histogram data
    post_data <- POST(
      url = "https://shiny-a9e90cfe443c.herokuapp.com/histogram-data",
      body = "{}",
      encode = "json"
    )
    # Parse the received JSON data
    post_json <- fromJSON(content(post_data, "text", encoding = "UTF-8"))
    output$post_output <- renderText(paste("Received from https://shiny-a9e90cfe443c.herokuapp.com/histogram-data: ", toString(post_json)))
  })
})
