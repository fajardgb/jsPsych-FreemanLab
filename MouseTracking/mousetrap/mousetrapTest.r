# Cleans JSPsych MouseTracking experiment output and performs mousetrap functions
# Relies on cleanup.r

library(mousetrap)
library(ggplot2)

file_path <- "MouseTracking/data/oob_data.csv"
clean_dir <- "MouseTracking/mousetrap/output"
file_name <- tools::file_path_sans_ext(basename(file_path))
clean_file_path <- file.path(clean_dir, paste0(file_name, "_clean.csv"))

# Clean data
message("▶ Cleaning data")
source("MouseTracking/mousetrap/cleanup.r")

# Import and align initial data
mt_data <- mt_import_long(filtered_long_data)
mt_data <- mt_align_start(mt_data)
mt_data <- mt_remap_symmetric(mt_data, remap_xpos = "no", remap_ypos = "up")
# mt_data <- mt_align(mt_data, coordinates=c(0, 0, 1, 1.5))

mt_plot(mt_data, use = "trajectories")
ggsave(file.path(clean_dir, paste0(file_name, "_plot.png")), width = 8, height = 6)
message("✓ Plot saved")

# mt_animate(mt_data, filename = "animated.gif", im_path = "MouseTracking/mousetrap/output")