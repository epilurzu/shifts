import { populate_next_possible_shift, get_combinations_of_weeks, get_weeks_by_categories } from "./utils.js";
import * as fs from "fs";

let rules = JSON.parse(fs.readFileSync("rules.json"));
let shift_info = JSON.parse(fs.readFileSync("shift_info_template.json"));

populate_next_possible_shift(shift_info, rules["rest_between_shifts"]);

let combinations_of_weeks = get_combinations_of_weeks(rules, shift_info);
let weeks_by_categories = get_weeks_by_categories(combinations_of_weeks);

//for (let week of combinations_of_weeks) {
//  console.log(week.join(" "));
//}
//console.log(combinations_of_weeks.length);

let weeks = weeks_by_categories["no_night"];
for (let week of weeks) {
  console.log(week.join(" "));
}
console.log(weeks.length);