library(whisker)

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


