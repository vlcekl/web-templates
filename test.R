library(jsonlite)
library(whisker)

# Generate data

states <- c('il', 'in', 'ia', 'mn', 'mo', 'wi', 'mi', 'oh', 'nd', 'sd', 'ne',
            'oh', 'ky')
states <- sort(toupper(states))

df <- data.frame(state = sample(states, 1000, replace = TRUE))

yield_state <- rnorm(length(states), 0, 20)
names(yield_state) <- states

df$yield <- yield_state[df$state] + rnorm(nrow(df), 200, 40)
max_yield <- floor(1.1*max(df$yield))

datalist <- seq(0, max_yield, 50)

all_inputs <- list(
  controls = list(
    inputSelect1 = states,
    inputSelect2 = states,
    inputSlider = list(min = 0, max = max_yield, step = 5,
                       value = mean(df$yield),
                       datalist = datalist),
    inputNumber = 20
  ),
  inputSelect1 = states[1],
  inputSelect2 = states[1],
  inputSlider = mean(df$yield),
  inputNumber = 20,
  data = df,
  data_proc = NULL
)

js <- toJSON(all_inputs, dataframe = 'columns', auto_unbox = TRUE)

write(js, "~/work/web/web-templates/data/dummy.json")


# Try mustache templates
template <-
'Hello {{name}}
You have just won ${{value}}!
{{#in_ca}}
Well, ${{taxed_value}}, after taxes
{{/in_ca}}'

data <- list(name = "Lukas",
             value = 10000,
             taxed_value = 10000 - (10000 * 0.4),
             in_ca = TRUE)

text <- whisker.render(template, data)
cat(text)

###################

template <-
'Hello
{{#myCondition}}
  la di da
{{/myCondition}}'
  
data = list(myCondition = TRUE)

text <- whisker.render(template, data)
cat(text)


data = list(users = c(1, 2, 3))

template <-
  '{{#users}}
  Hello {{.}}
  {{/users}}'

text <- whisker.render(template, data)
cat(text)

library(igraph)

g4 <- graph( c("John", "Jim", "Jim", "Jack", "Jim", "Jack", "John", "John"), 
             isolates=c("Jesse", "Janis", "Jennifer", "Justin") ) 


