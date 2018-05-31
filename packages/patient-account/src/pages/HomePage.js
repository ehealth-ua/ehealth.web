import React from "react";
import { Title, Link } from "@ehealth/components";
import { ArrowRight } from "@ehealth/icons";

import Tabs from "../components/Tabs";
import OrderedList from "../components/OrderedList";
import Line from "../components/Line";

const HomePage = () => (
  <>
    <Title.H1>особистий кабінет</Title.H1>
    <Tabs>
      {[
        {
          title: "Моя декларація",
          content: (
            <>
              <p>
                Декларація відсутня. Для підписання декларації, виконайте
                наступні кроки
              </p>
              <OrderedList>
                {[
                  "Оберіть лікаря",
                  "Створіть запит на декларацію",
                  "Очікуйте на підтвердження"
                ]}
              </OrderedList>
              <Line />

              <Link
                to="/search"
                size="small"
                upperCase
                spaced
                bold
                icon={<ArrowRight height="15px" fill="#2292f2" />}
              >
                крок 1. оберіть лікаря
              </Link>
            </>
          )
        },
        { title: "Мої рецепти", content: "Сторінка в процесі розробки" }
      ]}
    </Tabs>
  </>
);

export default HomePage;
