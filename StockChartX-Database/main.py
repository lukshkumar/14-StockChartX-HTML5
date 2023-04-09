from sqlalchemy import create_engine, MetaData, select
from sqlalchemy.orm import Session
import pandas as pd
#from flask import Flask, request
from fastapi import FastAPI, Request
#from flask_cors import CORS
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn


app = FastAPI()

#CORS(app)
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins)

database_connection_string = 'postgresql://postgres:postgres@ec2-18-141-177-116.ap-southeast-1.compute.amazonaws.com:5432/Project-Hamburg'
engine = create_engine(database_connection_string)
session = Session(engine)
conn = engine.connect()

meta = MetaData(bind=engine)
MetaData.reflect(meta)
TickerTable = meta.tables['Ticker']
TDAmeritradeDailyTable = meta.tables['TDAmeritradeDailyPrice']
TDAmeritradeMinuteTable = meta.tables['TDAmeritradeMinutePrice']

@app.get('/')
def database_query(Ticker:str='AAPL', Time:str=1):
    
    #Parameters
    #ticker_name = request.args.get('Ticker', 'AAPL')
    ticker_name= Ticker
    #timeframe_minutes = request.args.get('Time', 1)
    timeframe_minutes = Time
    timeframe_minutes_int = int(timeframe_minutes)
    result_filename = ticker_name + "-" + timeframe_minutes + ".csv"
    result_filepath = "../src/data/" + result_filename
    if (os.path.exists(result_filepath)):
        return 'data/' + result_filename
        
   # Choose any time_frame value from the below. You can put any number in place of x
    '''
    x minutes - Minute 1, 5, 10, 15, 30, 60, 90, 120, 180, 240, 409,
    x days - Daily 1 Day, 2 Day, 3 Day
    microseconds
    milliseconds
    second
    minute
    hour
    day
    week
    month
    quarter
    year
    decade
    century
    millennium
    '''
    # A day has 1440 minutes.
    if(timeframe_minutes_int % 1440 == 0):
        total_days = int(timeframe_minutes_int / 1440)
        time_frame = str(total_days) + " days"
        table_name = "TDAmeritradeDailyPrice" # use "TDAmeritradeDailyPrice" for Daily Table or "TDAmeritradeMinutePrice" for Minute Table
    else:
        time_frame = timeframe_minutes + " minutes" 
        table_name = "TDAmeritradeMinutePrice" # use "TDAmeritradeDailyPrice" for Daily Table or "TDAmeritradeMinutePrice" for Minute Table

    if("days" in time_frame):
        datetime_truncate = f'date_bin(\'{time_frame}\', "Date", TIMESTAMP \'2001-01-01\')'
    else:
        datetime_truncate = f'date_bin(\'{time_frame}\', "Date" + "Time", TIMESTAMP \'2001-01-01\')'

    # if(len(time_frame.split()) > 1):
    #     if("days" in time_frame):
    #         datetime_truncate = f'date_bin(\'{time_frame}\', "Date", TIMESTAMP \'2001-01-01\')'
    #     else:
    #         datetime_truncate = f'date_bin(\'{time_frame}\', "Date" + "Time", TIMESTAMP \'2001-01-01\')'
    # else:
    #     datetime_truncate = f'date_trunc(\'{time_frame}\', "Date")'

    # Query
    statement = select(TickerTable.c.Id).where(TickerTable.c.Symbol == ticker_name)
    for row in conn.execute(statement):
        ticker_id = row[0]

    statement = f'''
    SELECT DISTINCT week as "Date", 
    first_value("Open") OVER w as "open", 
    max("High") OVER w as "high",
    min("Low") OVER w as "low",
    last_value("Close") OVER w as "close",
    sum("Volume") Over w as "volume"
    FROM (SELECT *, {datetime_truncate} as week
    from public."{table_name}" where "TickerId" = {ticker_id}) as foo
    WINDOW w AS (PARTITION BY week ORDER BY week)
    order by week
    '''

    df_aggregated = pd.read_sql(statement, session.bind)
    #df_aggregated.insert(loc = 0, column = "Date", value = pd.to_datetime(df_aggregated['DateTime']).dt.date)
    #df_aggregated.insert(loc = 1, column = "Time", value = pd.to_datetime(df_aggregated['DateTime']).dt.time)
    #df_aggregated = df_aggregated.drop(columns=['DateTime'], axis =1)
    #df_string  = df_aggregated.to_string(index=False).split('\n')
    #df_csv_list = df_aggregated.to_csv(result_filepath, index=False).split('\n')
    #df_string = '\n'.join(df_csv_list)
    df_aggregated.to_csv(result_filepath, index=False)
    return 'data/' + result_filename

if __name__ == '__main__':
    uvicorn.run("main:app")




