function time_between(t1, t2) {
  return 24 - t1 + t2;
}

function too_many_in_a_row(combination, schedule, max_in_row) {
  if (combination.length < max_in_row) {
    return false;
  } else if (max_in_row == 0 || combination.length == 0) {
    return true;
  } else {
    let last_item = combination.length - 1;
    if (combination[last_item] == schedule) {
      combination.pop();
      max_in_row--;
      return too_many_in_a_row(combination, schedule, max_in_row);
    }
  }
}

function _get_combinations(rules, shift_schedules, combinations, combination) {
  //The whole week has been calculated
  if (combination.length == 7) {
    combinations.push(combination);
    return combinations;
  } else {
    var last_item = combination.length - 1;
    let schedule = combination[last_item];

    //check if last schedule in combination has a required
    if (shift_schedules[schedule]["required"] != undefined) {
      combination.push(shift_schedules[schedule]["required"]);
      return _get_combinations(
        rules,
        shift_schedules,
        combinations,
        combination
      );
    } else if (shift_schedules[schedule]["possibilities"] != undefined) {
      //consider all last schedule possibilities
      for (possibility of shift_schedules[schedule]["possibilities"]) {
        let combination_copy = [...combination];
        combination_copy.push(possibility);

        combinations = _get_combinations(
          rules,
          shift_schedules,
          combinations,
          combination_copy
        );
        //if (
        //  too_many_in_a_row(
        //    [...combination],
        //    candidate,
        //    shift_schedules[candidate]["max_in_row"]
        //  )
        //) {
        //  console.log(" Too many in a row: " + candidate);
        //}
      }
      return combinations;
    } else {
      console.error("Something is wrong!");
    }
  }
}

function get_combinations(rules, shift_schedules) {
  let combinations = [];

  //for (schedule in shift_schedules) {
  //}

  return _get_combinations(rules, shift_schedules, combinations, ["1"]);
}

const fs = require("fs");

let rawdata = fs.readFileSync("rules.json");
let rules = JSON.parse(rawdata);
rawdata = fs.readFileSync("shift_schedules.json");
let shift_schedules = JSON.parse(rawdata);

//morning
if (
  time_between(shift_schedules["1"]["end"], shift_schedules["2"]["start"]) >=
  rules["rest_between_shifts"]
) {
  shift_schedules["1"]["possibilities"].push("2");
}
if (
  time_between(shift_schedules["1"]["end"], shift_schedules["3"]["start"]) >=
  rules["rest_between_shifts"]
) {
  shift_schedules["1"]["possibilities"].push("3");
}

//evening
if (
  time_between(shift_schedules["2"]["end"], shift_schedules["1"]["start"]) >=
  rules["rest_between_shifts"]
) {
  shift_schedules["2"]["possibilities"].push("1");
}
if (
  time_between(shift_schedules["2"]["end"], shift_schedules["3"]["start"]) >=
  rules["rest_between_shifts"]
) {
  shift_schedules["2"]["possibilities"].push("3");
}

let combinations = get_combinations(rules, shift_schedules);

for (combination of combinations) {
  console.log(combination.join(","));
}
