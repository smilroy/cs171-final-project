##Set working directory
setwd("/Users/shannonmilroy/Documents/Harvard School Files/Spring 2015/Visualization/cs171-final-project/data/Original data")

#####Data load for first time code is run#####
data_HIV <- read.csv("IHME_GBD_2013_MDG6_1990_2013_HIV_TB_INCIDENCE_PREVALENCE_DEATHS_Y2014M11D21.CSV", colClasses="character")
save(data_HIV,file="data_HIV.Rda")

require(xlsx)
data_population_both <- read.xlsx("WPP2012_POP_F15_1_ANNUAL_POPULATION_BY_AGE_BOTH_SEXES.XLS", sheetName="ESTIMATES")
save(data_population_both,file="data_population_both.Rda")

data_population_female <- read.xlsx("WPP2012_POP_F15_3_ANNUAL_POPULATION_BY_AGE_FEMALE.XLS", sheetName="ESTIMATES")
save(data_population_female,file="data_population_female.Rda")

data_population_male <- read.xlsx("WPP2012_POP_F15_2_ANNUAL_POPULATION_BY_AGE_MALE.XLS", sheetName="ESTIMATES")
save(data_population_male,file="data_population_male.Rda")

data_MORTALITY <- read.csv("IHME_GBD_2010_MORTALITY_AGE_SPECIFIC_BY_COUNTRY_1970_2010.CSV")
save(data_MORTALITY,file="data_MORTALITY.Rda")

#########HIV specific data#####################
##Load data
load("data_HIV.Rda")

##Subset to HIV/AIDS
data_HIV <- subset(data_HIV, cause_name=="HIV/AIDS", select = c(location_name, year, age_group_name, sex_name, metric, mean))
data_HIV <- subset(data_HIV,!(data_HIV$age_group_name %in% c("Age-standardized","All Ages")))

##Relevel
library(plyr)
data_HIV$age_group_name <- revalue(data_HIV$age_group_name, c("Under 5"="0-4", 
                                   "5 to 9"="5-9",
                                   "10 to 14"="10-14",
                                   "15 to 19"="15-19",
                                   "20 to 24"="20-24",
                                   "25 to 29"="25-29",
                                   "30 to 34"="30-34",
                                   "35 to 39"="35-39",
                                   "40 to 44"="40-44",
                                   "45 to 49"="45-49",
                                   "50 to 54"="50-54",
                                   "55 to 59"="55-59",
                                   "60 to 64"="60-64",
                                   "65 to 69"="65-69",
                                   "70 to 74"="70-74",
                                   "75 to 79"="75-79",
                                   "80 plus"="80+"))

data_HIV <- subset(data_HIV, year < 2011)

summary_categories <- c("Andean Latin America",
                        "Australasia",
                        "Caribbean",
                        "Central Asia",
                        "Central Europe",
                        "Central Europe, Eastern Europe, and Central Asia",
                        "Central Latin America",
                        "Central Sub-Saharan Africa",
                        "Developed",
                        "Developing",
                        "East Asia",
                        "Eastern Europe",
                        "Eastern Sub-Saharan Africa",
                        "Global",
                        "High-income",
                        "High-income Asia Pacific",
                        "High-income North America",
                        "Latin America and Caribbean",
                        "North Africa and Middle East",
                        "Oceania",
                        "South Asia",
                        "Southeast Asia",
                        "Southeast Asia, East Asia, and Oceania",
                        "Southern Latin America",
                        "Southern Sub-Saharan Africa",
                        "Sub-Saharan Africa",
                        "Tropical Latin America",
                        "Western Europe",
                        "Western Sub-Saharan Africa")

data_HIV <- subset(data_HIV, !(data_HIV$location_name %in% summary_categories))

##drop_countries <- c("Andorra",
##                    "Dominica",
##                    "Marshall Islands",
##                    "South Sudan")

##data_HIV <- subset(data_HIV, !(data_HIV$location_name %in% drop_countries))
data_HIV$mean <- as.numeric(data_HIV$mean)
data_HIV$metric <- revalue(data_HIV$metric, c("Prevalence"="hiv_population_total", "Deaths"="hiv_deaths_total"))

###############Load data for total population both sexes##################
load("data_population_both.Rda")

##Subset to relevant years
data_population_both <- data_population_both[16:nrow(data_population_both),]
row_name <- c("id","metric","location_name","Notes","Country code","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+")
colnames(data_population_both) <- row_name
data_population_both <- data_population_both[2:nrow(data_population_both),]
data_population_both$year <- as.numeric(as.character(data_population_both$year))
data_population_both <- subset(data_population_both, data_population_both$year>1989, select = c("location_name","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+"))

data_population_both$eightyplus <- apply(data_population_both[20:24], 1, function(x) sum(as.numeric(x)))

data_population_both$"80+" <- ifelse(is.na(as.numeric(as.character(data_population_both$"80+"))),as.numeric(as.character(data_population_both$eightyplus)), as.numeric(as.character(data_population_both$"80+")))

data_population_both$"0-4" <- as.numeric(as.character(data_population_both$"0-4"))
data_population_both$"5-9" <- as.numeric(as.character(data_population_both$"5-9"))
data_population_both$"10-14" <- as.numeric(as.character(data_population_both$"10-14"))
data_population_both$"15-19" <- as.numeric(as.character(data_population_both$"15-19"))
data_population_both$"20-24" <- as.numeric(as.character(data_population_both$"20-24"))
data_population_both$"25-29" <- as.numeric(as.character(data_population_both$"25-29"))
data_population_both$"30-34" <- as.numeric(as.character(data_population_both$"30-34"))
data_population_both$"35-39" <- as.numeric(as.character(data_population_both$"35-39"))
data_population_both$"40-44" <- as.numeric(as.character(data_population_both$"40-44"))
data_population_both$"45-49" <- as.numeric(as.character(data_population_both$"45-49"))
data_population_both$"50-54" <- as.numeric(as.character(data_population_both$"50-54"))
data_population_both$"55-59" <- as.numeric(as.character(data_population_both$"55-59"))
data_population_both$"60-64" <- as.numeric(as.character(data_population_both$"60-64"))
data_population_both$"65-69" <- as.numeric(as.character(data_population_both$"65-69"))
data_population_both$"70-74" <- as.numeric(as.character(data_population_both$"70-74"))
data_population_both$"75-79" <- as.numeric(as.character(data_population_both$"75-79"))

drop = names(data_population_both) %in% c("eightyplus","80-84","85-89","90-94","95-99","100+")
data_population_both <- data_population_both[!drop]

##Reshape data
library(reshape) 
data_population_both <- melt(data_population_both, id = c("location_name","year"))
data_population_both$sex_name <- "Both sexes"
data_population_both$metric <- "population_total"
colnames(data_population_both)[3] <- "age_group_name"
colnames(data_population_both)[4] <- "mean"
data_population_both$mean <- as.numeric(as.character(data_population_both$mean))
data_population_both$mean <- data_population_both$mean*1000
data_population_both$location_name <- as.character(data_population_both$location_name)
data_population_both$age_group_name <- as.character(data_population_both$age_group_name)

summary_categories <- c("AFRICA",
                        "ASIA",
                        "Eastern Africa",
                        "Eastern Asia",
                        "Eastern Europe",
                        "Caribbean",
                        "Central America",
                        "Central Asia",
                        "EUROPE",
                        "LATIN AMERICA AND THE CARIBBEAN",
                        "Least developed countries",
                        "Less developed regions",
                        "Less developed regions, excluding China",
                        "Less developed regions, excluding least developed countries",
                        "Melanesia",
                        "Micronesia",
                        "Middle Africa",
                        "More developed regions",
                        "New Caledonia",
                        "Northern Africa",
                        "NORTHERN AMERICA",
                        "Northern Europe",
                        "OCEANIA",
                        "Other non-specified areas",
                        "Polynesia",
                        "South America",
                        "South-Central Asia",
                        "South-Eastern Asia",
                        "Southern Africa",
                        "Southern Asia",
                        "Southern Europe",
                        "Sub-Saharan Africa",
                        "Western Africa",
                        "Western Asia",
                        "Western Europe",
                        "Western Sahara",
                        "WORLD")

data_population_both <- subset(data_population_both, !(data_population_both$location_name %in% summary_categories))

drop_countries <- c("Aruba",
                    "Australia/New Zealand",
                    "Channel Islands",
                    "China, Honk Kong SAR",
                    "China, Macao SAR",
                    "Curaçao",
                    "French Guiana",
                    "French Polynesia",
                    "Guadeloupe",
                    "Guam",
                    "Martinique",
                    "Mayotte",
                    "Melanesia",
                    "Micronesia",
                    "New Caledonia",
                    "Polynesia",
                    "Puerto Rico",
                    "Réunion",
                    "South Sudan",
                    "United States Virgin Islands")

data_population_both <- subset(data_population_both, !(data_population_both$location_name %in% drop_countries))

library(car)
data_population_both$location_name <- revalue(data_population_both$location_name, 
                                              c("Bahamas"="The Bahamas",
                                                "Bolivia (Plurinational State of)"="Bolivia",
                                                "Brunei Darussalam"="Brunei",
                                                "Côte d'Ivoire" = "Cote d'Ivoire",
                                                "Gambia"="The Gambia",
                                                "Iran (Islamic Republic of)"="Iran",
                                                "Lao People's Democratic Republic"="Laos",
                                                "TFYR Macedonia"="Macedonia",
                                                "Micronesia (Fed. States of)"="Federated States of Micronesia",
                                                "Dem. People's Republic of Korea"="North Korea",
                                                "State of Palestine"="Palestine",
                                                "Russian Federation"="Russia",
                                                "Republic of Korea"="South Korea",
                                                "Syrian Arab Republic"="Syria",
                                                "United Republic of Tanzania"="Tanzania",
                                                "United States of America"="United States",
                                                "Venezuela (Bolivarian Republic of)"="Venezuela",
                                                "Viet Nam"="Vietnam"
                                                ))

###############Load data for total population female##################
load("data_population_female.Rda")

##Subset to relevant years
data_population_female <- data_population_female[16:nrow(data_population_female),]
row_name <- c("id","metric","location_name","Notes","Country code","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+")
colnames(data_population_female) <- row_name
data_population_female <- data_population_female[2:nrow(data_population_female),]
data_population_female$year <- as.numeric(as.character(data_population_female$year))
data_population_female <- subset(data_population_female, data_population_female$year>1989, select = c("location_name","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+"))

data_population_female$eightyplus <- apply(data_population_female[20:24], 1, function(x) sum(as.numeric(x)))

data_population_female$"80+" <- ifelse(is.na(as.numeric(as.character(data_population_female$"80+"))),data_population_female$eightyplus, data_population_female$"80+")

data_population_female$"0-4" <- as.numeric(as.character(data_population_female$"0-4"))
data_population_female$"5-9" <- as.numeric(as.character(data_population_female$"5-9"))
data_population_female$"10-14" <- as.numeric(as.character(data_population_female$"10-14"))
data_population_female$"15-19" <- as.numeric(as.character(data_population_female$"15-19"))
data_population_female$"20-24" <- as.numeric(as.character(data_population_female$"20-24"))
data_population_female$"25-29" <- as.numeric(as.character(data_population_female$"25-29"))
data_population_female$"30-34" <- as.numeric(as.character(data_population_female$"30-34"))
data_population_female$"35-39" <- as.numeric(as.character(data_population_female$"35-39"))
data_population_female$"40-44" <- as.numeric(as.character(data_population_female$"40-44"))
data_population_female$"45-49" <- as.numeric(as.character(data_population_female$"45-49"))
data_population_female$"50-54" <- as.numeric(as.character(data_population_female$"50-54"))
data_population_female$"55-59" <- as.numeric(as.character(data_population_female$"55-59"))
data_population_female$"60-64" <- as.numeric(as.character(data_population_female$"60-64"))
data_population_female$"65-69" <- as.numeric(as.character(data_population_female$"65-69"))
data_population_female$"70-74" <- as.numeric(as.character(data_population_female$"70-74"))
data_population_female$"75-79" <- as.numeric(as.character(data_population_female$"75-79"))

drop = names(data_population_female) %in% c("eightyplus","80-84","85-89","90-94","95-99","100+")
data_population_female <- data_population_female[!drop]

##Reshape data
data_population_female <- melt(data_population_female, id = c("location_name","year"))
data_population_female$sex_name <- "Females"
data_population_female$metric <- "population_total"
colnames(data_population_female)[3] <- "age_group_name"
colnames(data_population_female)[4] <- "mean"
data_population_female$mean <- as.numeric(as.character(data_population_female$mean))
data_population_female$mean <- data_population_female$mean*1000
data_population_female$location_name <- as.character(data_population_female$location_name)
data_population_female$age_group_name <- as.character(data_population_female$age_group_name)

data_population_female <- subset(data_population_female, !(data_population_female$location_name %in% summary_categories))
data_population_female <- subset(data_population_female, !(data_population_female$location_name %in% drop_countries))

data_population_female$location_name <- revalue(data_population_female$location_name, 
                                              c("Bahamas"="The Bahamas",
                                                "Bolivia (Plurinational State of)"="Bolivia",
                                                "Brunei Darussalam"="Brunei",
                                                "Côte d'Ivoire" = "Cote d'Ivoire",
                                                "Gambia"="The Gambia",
                                                "Iran (Islamic Republic of)"="Iran",
                                                "Lao People's Democratic Republic"="Laos",
                                                "TFYR Macedonia"="Macedonia",
                                                "Micronesia (Fed. States of)"="Federated States of Micronesia",
                                                "Dem. People's Republic of Korea"="North Korea",
                                                "State of Palestine"="Palestine",
                                                "Russian Federation"="Russia",
                                                "Republic of Korea"="South Korea",
                                                "Syrian Arab Republic"="Syria",
                                                "United Republic of Tanzania"="Tanzania",
                                                "United States of America"="United States",
                                                "Venezuela (Bolivarian Republic of)"="Venezuela",
                                                "Viet Nam"="Vietnam"
                                              ))

###############Load data for total population male##################
load("data_population_male.Rda")

##Subset to relevant years
data_population_male <- data_population_male[16:nrow(data_population_male),]
row_name <- c("id","metric","location_name","Notes","Country code","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+")
colnames(data_population_male) <- row_name
data_population_male <- data_population_male[2:nrow(data_population_male),]
data_population_male$year <- as.numeric(as.character(data_population_male$year))
data_population_male <- subset(data_population_male, data_population_male$year>1989, select = c("location_name","year","0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+","80-84","85-89","90-94","95-99","100+"))

data_population_male$eightyplus <- apply(data_population_male[20:24], 1, function(x) sum(as.numeric(x)))

data_population_male$"80+" <- ifelse(is.na(as.numeric(as.character(data_population_male$"80+"))),data_population_male$eightyplus, data_population_male$"80+")

data_population_male$"0-4" <- as.numeric(as.character(data_population_male$"0-4"))
data_population_male$"5-9" <- as.numeric(as.character(data_population_male$"5-9"))
data_population_male$"10-14" <- as.numeric(as.character(data_population_male$"10-14"))
data_population_male$"15-19" <- as.numeric(as.character(data_population_male$"15-19"))
data_population_male$"20-24" <- as.numeric(as.character(data_population_male$"20-24"))
data_population_male$"25-29" <- as.numeric(as.character(data_population_male$"25-29"))
data_population_male$"30-34" <- as.numeric(as.character(data_population_male$"30-34"))
data_population_male$"35-39" <- as.numeric(as.character(data_population_male$"35-39"))
data_population_male$"40-44" <- as.numeric(as.character(data_population_male$"40-44"))
data_population_male$"45-49" <- as.numeric(as.character(data_population_male$"45-49"))
data_population_male$"50-54" <- as.numeric(as.character(data_population_male$"50-54"))
data_population_male$"55-59" <- as.numeric(as.character(data_population_male$"55-59"))
data_population_male$"60-64" <- as.numeric(as.character(data_population_male$"60-64"))
data_population_male$"65-69" <- as.numeric(as.character(data_population_male$"65-69"))
data_population_male$"70-74" <- as.numeric(as.character(data_population_male$"70-74"))
data_population_male$"75-79" <- as.numeric(as.character(data_population_male$"75-79"))

drop = names(data_population_male) %in% c("eightyplus","80-84","85-89","90-94","95-99","100+")
data_population_male <- data_population_male[!drop]

##Reshape data
data_population_male <- melt(data_population_male, id = c("location_name","year"))
data_population_male$sex_name <- "Males"
data_population_male$metric <- "population_total"
colnames(data_population_male)[3] <- "age_group_name"
colnames(data_population_male)[4] <- "mean"
data_population_male$mean <- as.numeric(as.character(data_population_male$mean))
data_population_male$mean <- data_population_male$mean*1000
data_population_male$location_name <- as.character(data_population_male$location_name)
data_population_male$age_group_name <- as.character(data_population_male$age_group_name)

data_population_male <- subset(data_population_male, !(data_population_male$location_name %in% summary_categories))
data_population_male <- subset(data_population_male, !(data_population_male$location_name %in% drop_countries))

data_population_male$location_name <- revalue(data_population_male$location_name, 
                                                c("Bahamas"="The Bahamas",
                                                  "Bolivia (Plurinational State of)"="Bolivia",
                                                  "Brunei Darussalam"="Brunei",
                                                  "Côte d'Ivoire" = "Cote d'Ivoire",
                                                  "Gambia"="The Gambia",
                                                  "Iran (Islamic Republic of)"="Iran",
                                                  "Lao People's Democratic Republic"="Laos",
                                                  "TFYR Macedonia"="Macedonia",
                                                  "Micronesia (Fed. States of)"="Federated States of Micronesia",
                                                  "Dem. People's Republic of Korea"="North Korea",
                                                  "State of Palestine"="Palestine",
                                                  "Russian Federation"="Russia",
                                                  "Republic of Korea"="South Korea",
                                                  "Syrian Arab Republic"="Syria",
                                                  "United Republic of Tanzania"="Tanzania",
                                                  "United States of America"="United States",
                                                  "Venezuela (Bolivarian Republic of)"="Venezuela",
                                                  "Viet Nam"="Vietnam"
                                                ))

###############General mortality data###################

##Load data
load("data_MORTALITY.Rda")

##Subset to relevant years
row_name <- c("iso3","location_name","year","age","sex_name","death_abs","death_abs_ui","death_rate","death_rate_ui")
colnames(data_MORTALITY) <- row_name
data_MORTALITY <- subset(data_MORTALITY, data_MORTALITY$year>1989, select = c("location_name","year","age","sex_name","death_abs"))

data_MORTALITY$age_group_name <- 0

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("0-6 days",
                                                                  "7-27 days",
                                                                  "28-364 days",
                                                                  "1-4 years"),"0-4",data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("5-9 years"),"5-9", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("10-14 years"),"10-14", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("15-19 years"),"15-19", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("20-24 years"),"20-24", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("25-29 years"),"25-29", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("30-34 years"),"30-34", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("35-39 years"),"35-39", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("40-44 years"),"40-44", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("45-49 years"),"45-49", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("50-54 years"),"50-54", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("55-59 years"),"55-59", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("60-64 years"),"60-64", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("65-69 years"),"65-69", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("70-74 years"),"70-74", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("75-79 years"),"75-79", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("80+ years"),"80+", data_MORTALITY$age_group_name)

data_MORTALITY$age_group_name <- ifelse(data_MORTALITY$age %in% c("All ages"),"All ages", data_MORTALITY$age_group_name)

data_MORTALITY <- subset(data_MORTALITY, select = -age)

##Collapse over age groups
library(doBy)
data_MORTALITY <- summaryBy(death_abs ~ location_name + year + age_group_name + sex_name, FUN=c(mean), data=data_MORTALITY)
data_MORTALITY$metric <- "deaths_total"
colnames(data_MORTALITY)[5] <- "mean"
data_MORTALITY$sex_name <- revalue(data_MORTALITY$sex_name, c("Both"="Both sexes",
                                                              "Female"="Females",
                                                              "Male"="Males"))
data_MORTALITY$mean <- as.numeric(as.character(data_MORTALITY$mean))
data_MORTALITY <- subset(data_MORTALITY,data_MORTALITY$age_group_name!="All ages")

drop_countries <- c("Andorra",
                    "Dominica",
                    "Marshall Islands")

data_MORTALITY <- subset(data_MORTALITY, !(data_MORTALITY$location_name %in% drop_countries))

data_MORTALITY$location_name <- revalue(data_MORTALITY$location_name, c('Brunei Darussalam'='Brunei',
                                                                        'Congo, the Democratic Republic of the'="Congo",
                                                                        "Bahamas"="The Bahamas",
                                                                        'Libyan Arab Jamahiriya'='Libya',
                                                                        "Korea, Democratic People's Republic of"="North Korea",
                                                                        'Macedonia, the Former Yugoslav Republic of'='Macedonia',
                                                                        'Occupied Palestinian Territory'='Palestine',
                                                                        'Korea, Republic of'='South Korea',
                                                                        'Syrian Arab Republic'='Syria',
                                                                        'Tanzania, United Republic of'='Tanzania',
                                                                        'Viet Nam'='Vietnam',
                                                                        "Gambia"="The Gambia",
                                                                        "Iran, Islamic Republic of"="Iran",
                                                                        "Lao People's Democratic Republic"="Laos",
                                                                        "Micronesia, Federated States of"="Federated States of Micronesia",
                                                                        "Russian Federation"="Russia"))

##################Append data#########################
data_total <- rbind(data_HIV,data_MORTALITY,data_population_both, data_population_male, data_population_female)

colnames(data_total)[6] <- "value"

##Create collapsed version
data_total_collapse <- melt(data_total, id = c("location_name","year", "age_group_name","sex_name","metric"))

data_total_collapse <- subset(data_total_collapse, select = -variable)
data_total_collapse <- cast(data_total_collapse, location_name + year + age_group_name + sex_name ~ metric, mean)

data_total_collapse <- data_total_collapse[,c("location_name", "year", "age_group_name", "sex_name", "deaths_total", "hiv_deaths_total", "population_total", "hiv_population_total")]

data_total_collapse <- subset(data_total_collapse, !(location_name %in% c("Andorra","Antigua and Barbuda","Bahrain","Cape Verde","Comoros","Dominica","Federated States of Micronesia","Grenada","Kiribati","Maldives","Malta","Marshall Islands","Mauritius","Republic of Moldova","Saint Lucia","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Seychelles","Singapore","Timor-Leste","Tonga", "China, Hong Kong SAR")))

data_total_collapse$location_name <- revalue(data_total_collapse$location_name, c('The Bahamas'='Bahamas', "The Gambia" = "Gambia", "Guinea-Bissau" = "Guinea Bissau"))

data_total_collapse <- data_total_collapse[order(data_total_collapse$location_name),] 

write.csv(data_total_collapse, "data_clean.csv")
