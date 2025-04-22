library(dplyr)
library(tidyr)
library(jsonlite)

file_path <- "MouseTracking/output/sub-965756_data.csv"

data <- read.csv(file_path)

# Filter for mouseTrackQuestion rows
mouse_track_questions <- data %>%
  filter(grepl("mouseTrackQuestion", trial_name))

# Add correct column
mouse_track_questions <- mouse_track_questions %>%
  rowwise() %>%
  mutate(
    correct = as.integer(
      (fromJSON(button_order)[response + 1]) ==
      ifelse(grepl("images/black", stimulus), "BLACK", "WHITE")
    )
  ) %>%
  ungroup()

# Flatten mouse tracking JSON into one table with trial identifiers
long_data <- mouse_track_questions %>%
  mutate(mt_id = row_number()) %>% # Adds mt_id column (trial identifier)
  rowwise() %>%
  mutate(parsed = list(fromJSON(mouse_tracking_data))) %>% # Parse json
  unnest(parsed) %>% # Explodes each event into separate row
  select(mt_id, x, y, t, rt, correct) %>%
  rename(
    xpos = x,
    ypos = y,
    timestamps = t
  )

# Save as csv
write.csv(long_data, "MouseTracking/output/long_data.csv", row.names = FALSE)