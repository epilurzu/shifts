import { populate_next_possible_shift, get_combinations_of_weeks } from "./utils.js";
import * as fs from "fs";

let rules = JSON.parse(fs.readFileSync("rules.json"));
let shift_info = JSON.parse(fs.readFileSync("shift_info.json"));

populate_next_possible_shift(shift_info, rules["rest_between_shifts"]);

let combinations_of_weeks = get_combinations_of_weeks(rules, shift_info);

for (let week of combinations_of_weeks) {
  console.log(week.join(" "));
}
console.log(combinations_of_weeks.length);
