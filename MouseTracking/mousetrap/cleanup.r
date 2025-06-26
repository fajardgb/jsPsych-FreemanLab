library(dplyr)
library(tidyr)
library(jsonlite)
library(stringr)

data <- read.csv(file_path)

# Get screen dimensions
screen_width <- first(na.omit(data$width))
screen_height <- first(na.omit(data$height))

# Calculate bounding box edges
# TODO: un-hardcode the bounding box dimensions
bb_top <- (screen_height/2)+(600/2)
bb_bot <- (screen_height/2)-(600/2)
bb_left <- (screen_width/2)-(800/2)
bb_right <- (screen_width/2)+(800/2)

mouse_track_questions <- data %>%
  # Filter for mouseTrackQuestion rows
  filter(grepl("mouseTrackQuestion", trial_name)) %>%

  # Adds mt_id column (trial identifier)
  mutate(mt_id = row_number()) %>%

  # Add stimulus column
  mutate(stimulus_id = str_match(stimulus, "/([a-zA-Z0-9]+)\\.png")[,2]) %>%

  # Add response, correct response, and correct columns
  rowwise() %>%
  mutate(
    chosen_response = fromJSON(button_order)[response + 1],

    correct_index = which(str_detect(stimulus, fromJSON(categories))),
    correct_response = fromJSON(button_order)[correct_index],

    correct = (chosen_response == correct_response)
  ) %>%
  ungroup() %>%

  # Mark trials that were too fast, too slow, or not in fullscreen
  mutate(
    too_fast = as.logical(too_fast),
    too_slow = as.logical(too_slow),
    not_fullscreen = !as.logical(fullscreen),
  ) %>%

  # Select and rename columns
  select(mt_id, mouse_tracking_data, rt, correct, chosen_response, correct_response, button_order, stimulus_id,
         too_fast, too_slow, not_fullscreen) %>%
  rename(
    response = chosen_response,
    stimulus = stimulus_id
  )

# Create table in long format for mousetrap
long_data <- mouse_track_questions %>%
  rowwise() %>%
  mutate(parsed = list(fromJSON(mouse_tracking_data))) %>% # Parse JSON
  unnest(parsed) %>% # Explodes each event into separate row
  ungroup()

# Detect out of bounds trials
oob_data <- long_data %>%
  rowwise() %>%
  group_by(mt_id) %>%
  mutate(out_of_bounds = any(x > bb_right | x < bb_left | y < bb_bot | y > bb_top)) %>%
  summarize(
    out_of_bounds = first(out_of_bounds),
    .groups = "drop"
  ) %>%
  ungroup()

# Add out of bounds column and clean columns
cleaned_data <- mouse_track_questions %>%
  left_join(oob_data, by = "mt_id") %>%
  select(mt_id, rt, correct, response, correct_response, button_order, stimulus,
         too_slow, too_fast, not_fullscreen, out_of_bounds)

# Remove bad trials
n_before <- nrow(cleaned_data)
filtered_data <- cleaned_data %>%
  filter(!if_any(all_of(c("too_slow", "too_fast", "not_fullscreen", "out_of_bounds"))))
n_after <- nrow(filtered_data)
message("🛈 ", n_before - n_after, " trials were removed")

# Save as csv
message(paste("✓ Saved cleaned CSV at", clean_file_path))
write.csv(cleaned_data, clean_file_path, row.names = FALSE)

# Filter long_data
filtered_long_data <- long_data %>%
  filter(mt_id %in% filtered_data$mt_id) %>%
  select(mt_id, x, y, t, rt, correct, response, correct_response, button_order, stimulus) %>%
  rename(
    xpos = x,
    ypos = y,
    timestamps = t
  )

# write.csv(filtered_long_data, "MouseTracking/mousetrap/output/filtered_long_data.csv", row.names = FALSE)