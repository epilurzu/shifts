import * as fs from "fs";

function time_between(t1, t2) {
  return 24 - t1 + t2;
}

export function populate_next_possible_shift(shift_info, rest_needed) {
  let start = 0;
  let end = 0;

  //morning
  start = shift_info["2"]["start"];
  end = shift_info["1"]["end"];
  if (time_between(end, start) >= rest_needed) {
    shift_info["1"]["next_possible_turn"].push("2");
  }

  start = shift_info["3"]["start"];
  if (time_between(end, start) >= rest_needed) {
    shift_info["1"]["next_possible_turn"].push("3");
  }

  //evening
  start = shift_info["1"]["start"];
  end = shift_info["2"]["end"];
  if (time_between(end, start) >= rest_needed) {
    shift_info["2"]["next_possible_turn"].push("1");
  }

  start = shift_info["3"]["start"];
  if (time_between(end, start) >= rest_needed) {
    shift_info["2"]["next_possible_turn"].push("3");
  }

  //sort
  for (let schedule in shift_info) {
    shift_info[schedule]["next_possible_turn"].sort();
  }
}

function are_too_many_in_a_row(week, possible_turn, max_in_row) {
  if (week.length < max_in_row) {
    return false;
  }
  else if (max_in_row == 0) {
    return true;
  }
  else {
    let last_turn = week.length - 1;
    if (week[last_turn] == possible_turn) {
      week.pop();
      max_in_row--;
      return are_too_many_in_a_row(week, possible_turn, max_in_row);
    }
  }
}

function are_weekly_hours_respected(rules, shift_info, week) {
  let hours = 0;
  for (let turn of week) {
    hours = hours + shift_info[turn]["duration"];
  }

  let min_hours = rules["min_weekly_hours"];
  let max_hours = rules["max_weekly_hours"];
  return min_hours <= hours && hours <= max_hours;
}

function are_not_too_many_in_a_row(week, rules) {

  var counter = rules["max_work_days_in_a_row"];

  for (let day of week) {
    if (day == "s" || day == "r") {
      counter = rules["max_work_days_in_a_row"];
    }
    else {
      counter--;
    }

    if (counter < 0) {
      return false;
    }
  }

  return true;
}

function _get_combinations_of_weeks(rules, shift_info, week, combinations = []) {
  //The whole week has been calculated
  if (week.length == 7) {
    if (are_weekly_hours_respected(rules, shift_info, week)) {
      if (are_not_too_many_in_a_row(week, rules)) {
        combinations.push(week);
      }
    }
    return combinations;
  }
  else {
    var last_turn_index = week.length - 1;
    let last_turn = week[last_turn_index];

    //consider all next possible shifts based on last turn
    for (let possible_turn of shift_info[last_turn]["next_possible_turn"]) {
      if (are_too_many_in_a_row([...week], possible_turn, shift_info[possible_turn]["max_in_row"])) {
        continue;
      }

      let week_copy = [...week];
      week_copy.push(possible_turn);

      combinations = _get_combinations_of_weeks(rules, shift_info, week_copy, combinations);
    }

    return combinations;
  }
}

export function get_combinations_of_weeks(rules, shift_info) {
  let combinations = [];

  //calculate every possible wook starting from sorted turns in shift_info
  Object.keys(shift_info).sort().forEach(function (turn) {
    combinations = [...combinations, ..._get_combinations_of_weeks(rules, shift_info, [turn])];
  });

  return combinations;
}

function is_legit_week(week, black_list) {
  for (let day of week) {
    if (black_list.includes(day)) {
      return false;
    }
  }

  return true;
}

export function get_weeks_by_categories(combinations_of_weeks) {
  let weeks_by_categories = JSON.parse(fs.readFileSync("weeks_by_categories_template.json"));

  combinations_of_weeks.forEach(function (week) {
    weeks_by_categories["starting_by"][week[0]].push(week);
    weeks_by_categories["ending_by"][week[6]].push(week);

    //populate only_morning and no_night
    let black_list = ["2", "3", "s"]
    if (is_legit_week(week, black_list)) {
      weeks_by_categories["only_morning"].push(week);
      weeks_by_categories["no_night"].push(week);
    }

    //populate only_evening and no_night
    black_list = ["1", "3", "s"]
    if (is_legit_week(week, black_list)) {
      weeks_by_categories["only_evening"].push(week);
      weeks_by_categories["no_night"].push(week);
    }
  });

  return weeks_by_categories;
}