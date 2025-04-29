library(dplyr)
library(tidyr)
library(jsonlite)
library(stringr)

file_path <- "MouseTracking/output/sample_data.csv"

data <- read.csv(file_path)

mouse_track_questions <- data %>%
  # Filter for mouseTrackQuestion rows
  filter(grepl("mouseTrackQuestion", trial_name)) %>%

  # Filter out trials that were too fast or too slow
  mutate(
    too_fast = as.logical(too_fast),
    too_slow = as.logical(too_slow)
  ) %>%
  filter(!(too_fast|too_slow)) %>%

  # Add correct response column
  mutate(
    correct_response = ifelse(grepl("images/black", stimulus), "BLACK", "WHITE")
  ) %>%

  # Add correct column
  rowwise() %>%
  mutate(
    correct = as.integer(
      (fromJSON(button_order)[response + 1]) == correct_response
    )
  ) %>%
  ungroup() %>%

  # Add response column
  mutate(
    button_order_list = lapply(button_order, fromJSON),
    chosen_response = mapply(function(order, resp) order[[resp + 1]], button_order_list, response)
  ) %>%

  # Add stimulus column
  mutate(stimulus_id = str_match(stimulus, "images/(?:black|white)/([a-zA-Z0-9]+)\\.png")[,2])

# Flatten mouse tracking JSON into one table with trial identifiers
long_data <- mouse_track_questions %>%
  mutate(mt_id = row_number()) %>% # Adds mt_id column (trial identifier)
  rowwise() %>%
  mutate(parsed = list(fromJSON(mouse_tracking_data))) %>% # Parse json
  unnest(parsed) %>% # Explodes each event into separate row
  select(mt_id, x, y, t, rt, correct, chosen_response, correct_response, button_order, stimulus_id) %>%
  rename(
    xpos = x,
    ypos = y,
    timestamps = t,
    response = chosen_response,
    stimulus = stimulus_id
  )

# Save as csv
write.csv(long_data, "MouseTracking/output/long_data.csv", row.names = FALSE)