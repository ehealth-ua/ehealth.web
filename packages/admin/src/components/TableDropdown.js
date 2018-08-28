import React from "react";
import { BooleanValue, SetValue } from "react-values";
import Dropdown from "./Dropdown";

type DropdownProps = {
  data: [{ value: string, default?: boolean }],
  onChange: () => mixed
};

/**
 * @example Dropdown
 *
 * Dropdown component takes array of object in data prop and return new array of checked objects
 *
 * const HEADER = [
 *   { id: "ID", default: true },
 *   { status: "Статус" },
 *   { startDate: "Початок періоду" },
 *   { endDate: "Кінець періоду", default: true }
 * ];
 *
 * ```jsx
 *   <Dropdown data={HEADER} onChange={value => console.log(value)} />
 * ```
 */

const TableDropdown = ({ data, onChange }: DropdownProps) => {
  const defaultValue = data.filter(item => Boolean(item.default));
  return (
    <SetValue defaultValue={new Set(defaultValue)}>
      {({ value, toggle, add, remove }) => {
        onChange([...value]);
        return (
          <Dropdown.List>
            {data.map((item, i) => {
              const title = Object.entries(item)[0][1];
              return (
                <BooleanValue
                  value={value.has(item)}
                  onChange={value => (value ? add(item) : remove(item))}
                  key={i}
                >
                  {({ value: on, toggle }) => (
                    <Dropdown.Item on={on} onClick={toggle}>
                      {title}
                      {on && <Dropdown.Icon />}
                    </Dropdown.Item>
                  )}
                </BooleanValue>
              );
            })}
          </Dropdown.List>
        );
      }}
    </SetValue>
  );
};

export default TableDropdown;
