library(jsonlite)
library(whisker)

# Generate data

states <- c('il', 'in', 'ia', 'mn', 'mo', 'wi', 'mi', 'oh', 'nd', 'sd', 'ne',
            'oh', 'ky')
states <- toupper(states)

df <- data.frame(state = sample(states, 1000, replace = TRUE))

yield_state <- rnorm(length(states), 0, 20)
names(yield_state) <- states

df$yield <- yield_state[df$state] + rnorm(nrow(df), 200, 40)

all_inputs <- list(
  data = df,
  data_proc = NULL,
  inputSelect = states,
  inputSlider = list(min = 0.0, max = 1.1*max(df$yield), value = mean(df$yield)),
  inputNumber = 20
)

js <- toJSON(all_inputs, dataframe = 'columns')

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


