import csv

flist = []
fjson = "[\n"


def toJSON():
    tlist = []
    global fjson
    with open('..\\..\\..\\13-production\\Tickers\\TickerList.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            tlist.append(row[0])
    flist.extend(tlist[1:])
    for tick in flist:
        fjson = fjson + "\t{ \"symbol\": \""+tick+"\", \"company\": \"N/A\", \"exchange\": \"S&P500\" },\n"
    fjson = fjson[:-2] + "\n]"
    with open('symbols_new.json', 'w') as file2:
        file2.write(fjson)

toJSON()
print(fjson)
