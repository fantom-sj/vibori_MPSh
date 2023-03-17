import eel
import math
import pandas as pd

from io import StringIO
from threading import Thread
from datetime import date


class MainThread(Thread):
    def __init__(self):
        super().__init__()

        self.tbl_itogi: pd.DataFrame  = None
        self.tbl_spiski: pd.DataFrame = None

    @staticmethod
    def calculate_age(data_txt):
        data_txt = data_txt.replace(" ", "")
        data_txt = data_txt.replace("г.", "")
        data_txt = data_txt.replace("Г.", "")
        data_txt = data_txt.replace("г", "")
        data_txt = data_txt.replace("Г", "")
        data_txt = data_txt.replace(",", ".")

        if not ("." in data_txt):
            print(f"формат даты не верный: {data_txt}. Перепишите дату в верном формате:")
            data_txt = input()

        data_split = data_txt.split(".")
        if len(data_split) == 3:
            d = int(data_split[0])
            m = int(data_split[1])
            y = int(data_split[2])
        elif len(data_split) == 2:
            d = 1
            m = int(data_split[0])
            y = int(data_split[1])
        else:
            d = 1
            m = 1
            y = int(data_split[0])

        if y < 1900:
            if 0 < y < 23:
                y = 2000 + y
            else:
                y = 1900 + y

        try:
            data_bern = date(y, m, d)
        except Exception as err:
            print(f"Возникла ошибка: {err}, при попытке преобразовать в дату: {data_txt}")
            data_txt = input("Введите корректную дату в формате **.**.****: ")
            d, m, y = data_txt.split(".")
            data_bern = date(int(y), int(m), int(d))

        today = date.today()
        return today.year - data_bern.year - ((today.month, today.day) < (data_bern.month, data_bern.day))

    def dataProcessing(self):
        list_itogi  = self.tbl_itogi.to_dict("list")
        list_spiski = self.tbl_spiski.to_dict("list")

        list_spiski["age"] = list()
        dict_spiski = dict()

        for idx in range(len(list_itogi["kod"])):
            telfon = list_itogi["telefon"][idx].replace("7", "8", 1)
            list_itogi["telefon"][idx] = telfon
            list_itogi["kod"][idx] = int(list_itogi["kod"][idx])

        for idx in range(len(list_spiski["telefon"])):
            telfn = list_spiski["telefon"][idx]
            if type(telfn) != str:
                if math.isnan(telfn):
                    continue
                else:
                    print(f"Ошибка в телефоне: {idx}, {telfn}, введите правильный телефон")
                    telfn = input()

            try:
                telfn = telfn.replace("+7", "8")
                telfn = telfn.replace("(", "")
                telfn = telfn.replace(")", "")
                telfn = telfn.replace("-", "")
                telfn = telfn.replace(" ", "")

                if telfn[0] == "9":
                    telfn = "8" + telfn
            except:
                continue

            if not(telfn in dict_spiski):
                # list_spiski["telefon"][idx] = telfn

                data_txt = list_spiski["data"][idx]
                if type(data_txt) != str:
                    if math.isnan(data_txt):
                        continue
                    else:
                        print(f"Ошибка в дате: {idx}, {data_txt}, введите правильную дату")
                        data_txt = input()

                age      = self.calculate_age(data_txt)
                # list_spiski["age"].append(age)
                dict_spiski[telfn] = age

        return self.dataConvergence(list_itogi, dict_spiski)

        # new_spiski = pd.DataFrame(list_spiski)
        # new_itogi = pd.DataFrame(list_itogi)
        #
        # print(new_spiski)
        # print(new_itogi)
        #
        # new_spiski.drop("age", axis=1).to_csv("Правильный список голосующих.csv", index=False)
        # new_itogi.to_csv("Правильный список голосов.csv", index=False)

    @staticmethod
    def dataConvergence(list_itogi, dict_spiski):
        itogoviy_spisok = dict()
        results = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        }

        for idx in range(len(list_itogi["kod"])):
            telefon = list_itogi["telefon"][idx]
            kod     = list_itogi["kod"][idx]

            try:
                age = dict_spiski[telefon]
            except KeyError:
                continue

            if 14 <= age <= 35:
                itogoviy_spisok[telefon] = kod
                results[kod] += 1

        return itogoviy_spisok, results

    def run(self):
        while True:
            if not(self.tbl_itogi is None) and not(self.tbl_spiski is None):
                print("Обе таблицы загружены, обрабатываем")
                itogoviy_spisok, results = self.dataProcessing()

                eel.printResult(results)

                itogi = {
                    "telefon": [],
                    "kod": [],
                }
                for telefon in itogoviy_spisok:
                    itogi["telefon"].append(telefon)
                    itogi["kod"].append(itogoviy_spisok[telefon])

                pd.DataFrame(itogi).to_csv("Итоговый список", index=False)

                self.tbl_itogi = None
                self.tbl_spiski = None


@eel.expose
def loadItogi(data: str):
    print("Получены итоги голосования")

    try:
        main_thread.tbl_itogi = pd.read_csv(StringIO(data), dtype=str)
    except:
        print("Ошибка формата загруженного csv файла")

    return 0


@eel.expose
def loadSpiski(data):
    print("Получены списки голосующих")

    try:
        main_thread.tbl_spiski = pd.read_csv(StringIO(data), dtype=str)
    except Exception as err:
        print("Ошибка формата загруженного csv файла")
        print(err)

    return 0


if __name__ == "__main__":
    main_thread = MainThread()
    main_thread.start()

    print("Запускаем интерфейс...")
    eel.init("interface")
    eel.start("index.html", mode="opera")

