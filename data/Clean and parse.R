##Set working directory
setwd("/Users/shannonmilroy/Documents/Harvard School Files/Spring 2015/Visualization/cs171-final-project/data/Original data")

##Load data
data <- read.csv("IHME_GBD_2013_MDG6_1990_2013_HIV_TB_INCIDENCE_PREVALENCE_DEATHS_Y2014M11D21.CSV")

##Subset to HIV/AIDS
data <- subset(data, cause_name=="HIV/AIDS", select = c(location_name, year, age_group_id,age_group_name, sex_name, cause_name, metric, mean, lower, upper))

##Write to csv
write.csv(data, "HIVAIDS_data_clean.csv")

##Write to xls
global <- subset(data,data$sex_name=="Both sexes"&data$location_name=="Sub-Saharan Africa"&data$metric=="Deaths"&(data$age_group_id<22&data$age_group_id>8))
library(xlsx)
write.xlsx(global, "HIVAIDS_data_clean2.xls")
