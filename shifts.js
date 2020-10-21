import { populate_possibilities, get_combinations } from "./utils.js";
import * as fs from "fs";

let rules = JSON.parse(fs.readFileSync("rules.json"));
let shift_schedules = JSON.parse(fs.readFileSync("shift_schedules.json"));

populate_possibilities(rules, shift_schedules);

let combinations = get_combinations(rules, shift_schedules);

combinations.sort((a, b) => {
  if (a[0] < b[0]) return -1;
  else if (a[0] > b[0]) return 1;
  else if (a[1] < b[1]) return -1;
  else if (a[1] > b[1]) return 1;
  else if (a[2] < b[2]) return -1;
  else if (a[2] > b[2]) return 1;
  else if (a[3] < b[3]) return -1;
  else if (a[3] > b[3]) return 1;
  else if (a[4] < b[4]) return -1;
  else if (a[4] > b[4]) return 1;
  else if (a[5] < b[5]) return -1;
  else if (a[5] > b[5]) return 1;
  else if (a[6] < b[6]) return -1;
  else if (a[6] > b[6]) return 1;
  else return 0;
});
for (let combination of combinations) {
  console.log(combination.join(" "));
}
console.log(combinations.length);
