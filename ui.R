## ui.R

library(plotly)
require(shiny)
library(shinyjs)

shinyUI(fluidPage(
  tags$head(
    tags$style(
      HTML(
        "
        .custom-sidebar-layout {
          background-color: #DCDCDC; /* Set your desired color here */
          padding: 15px; /* Optional: Add padding for a cleaner look */
        }
        "
      )
    ),
    includeScript("shiny.js")
  ),
  # Application title
    titlePanel("Test API App"),

  # Sidebar with a slider input for number of bins
 sidebarLayout(
    sidebarPanel(
      selectizeInput("drug", "Select Drug", choices = NULL, options = list(placeholder = "Select a drug")),

      selectizeInput("sample_type", "Select Sample Type", choices = NULL, options = list(placeholder = "Select a sample type")),
      
      selectizeInput("study_population", "Select Study Population", choices = NULL, options = list(placeholder = "Select a study population")),
      
      selectizeInput("route_of_admin", "Select Route of Administration", choices = NULL, options = list(placeholder = "Select a route of administration")),
      
      selectizeInput("formulation", "Select Formulation", choices = NULL, options = list(placeholder = "Select a formulation")),


      # Numeric input for Dose in mg
      numericInput("dose_mg", "Enter Dose in mg", value = NULL, min = 0),

      # Group of filter checkboxes for trimesters
      checkboxGroupInput("trimesters", "Select Trimesters",
                         choices = NULL,
                         inline = TRUE),
                             class = "custom-sidebar-layout"

    ),
    
    # Show a plot of the generated distribution
    mainPanel(
      plotlyOutput("lineChart")  
    ),
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

