## ui.R

require(shiny)

shinyUI(fluidPage(

  # Application title
    titlePanel("Test API App"),

  # Sidebar with a slider input for number of bins
  mainPanel(
      plotOutput("distPlot")
    ),

   br(),
    fluidRow(
    column(6,
    # ActionButton for GET API Request
    p("GET Request to clinicaltrials.gov and print number of participants in the ECLAIR clinical trial"),
    actionButton("get_btn", "SEND GET Request"),
    verbatimTextOutput("get_output")
    ),
    column(6,
           # ActionButton for POST API Request
           p("POST method sending a simple text string (REQUIRES API ENDPOINT URL TO WORK):"),
           actionButton("post_btn", "SEND POST Data"),
           verbatimTextOutput("post_output")
    )
    )
))