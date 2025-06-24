library(dplyr)
library(tidyr)
library(jsonlite)
library(stringr)

data <- read.csv(file_path)

mouse_track_questions <- data %>%
  # Filter for mouseTrackQuestion rows
  filter(grepl("mouseTrackQuestion", trial_name)) %>%

  # Adds mt_id column (trial identifier)
  mutate(mt_id = row_number()) %>%

  # Filter out trials that were too fast or too slow
  mutate(
    too_fast = as.logical(too_fast),
    too_slow = as.logical(too_slow)
  ) %>%
  filter(!(too_fast|too_slow)) %>%

  # Add correct response column
  rowwise() %>%
  mutate(
    correct_response = {
      match <- fromJSON(categories)[str_detect(stimulus, fixed(fromJSON(categories)))]
      match[1]
    }
  ) %>%
  ungroup() %>%

  # Add correct column
  rowwise() %>%
  mutate(
    correct = as.integer(
      (fromJSON(categories)[response + 1]) == correct_response
    )
  ) %>%
  ungroup() %>%

  # Add response column
  mutate(
    button_order_list = lapply(button_order, fromJSON),
    chosen_response = mapply(function(order, resp) order[[resp + 1]], button_order_list, response)
  ) %>%

  # Add stimulus column
  mutate(stimulus_id = str_match(stimulus, "/([a-zA-Z0-9]+)\\.png")[,2])


# Flatten mouse tracking JSON into one table with trial identifiers
long_data <- mouse_track_questions %>%
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
print(paste("Saved cleaned CSV at", clean_file_path))
write.csv(long_data, clean_file_path, row.names = FALSE)