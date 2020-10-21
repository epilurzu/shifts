import { populate_possibilities, get_combinations } from "./utils.js";
import * as fs from "fs";

let rules = JSON.parse(fs.readFileSync("rules.json"));
let shift_schedules = JSON.parse(fs.readFileSync("shift_schedules.json"));

populate_possibilities(rules, shift_schedules);

let combinations = get_combinations(rules, shift_schedules);

for (let combination of combinations) {
  console.log(combination.join(" "));
}
console.log(combinations.length);
