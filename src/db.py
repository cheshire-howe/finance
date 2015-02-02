from pymongo import MongoClient

import pandas as pd
from pandas.io.data import get_data_yahoo

from datetime import datetime, timedelta
from dateutil import parser
import json

db = MongoClient('192.168.2.13', 27017).stocks


def make_current(symbol, data):
    today = datetime.now().date()
    weekday = datetime.today().weekday()
    if weekday is 5:
        today = today - timedelta(days=1)
    if weekday is 6:
        today = today - timedelta(days=2)
    data = json.loads(data)
    max_date = get_max_date(data)
    if (max_date < today):
        delta = (today - max_date).days - 1
        new_data = get_data_yahoo(
            symbol, datetime.now() - timedelta(days=delta))
        if new_data.empty is not True:
            new_data = convert_pandas_to_list(new_data)
            for d in new_data:
                db.hist.update(
                    {
                        'symbol': symbol
                    },
                    {
                        '$push': {
                            'data': d
                        }
                    },
                    True
                )


def convert_pandas_to_json(data):
    data['date'] = data.index.map(lambda x: x)
    data.rename(columns={
        'Open': 'open',
        'High': 'high',
        'Low': 'low',
        'Close': 'close',
        'Volume': 'volume'}, inplace=True)
    data = data.to_json(orient='records', date_format='iso')
    return data


def convert_pandas_to_list(data):
    data['date'] = data.index.map(lambda x: x)
    data.rename(columns={
        'Open': 'open',
        'High': 'high',
        'Low': 'low',
        'Close': 'close',
        'Volume': 'volume'}, inplace=True)
    data = data.to_dict(orient='records')
    return data


def get_stock_json(symbol, days):
    data = db.hist.find_one({"symbol": symbol})['data']
    js_data = [d for d in data if d['date']
               >= datetime.now() - timedelta(days=int(days))]
    data = json.dumps(js_data, default=json_serial)
    return data


def get_stock_pandas(symbol):
    data = db.hist.find_one({"symbol": symbol})['data']
    data = pd.DataFrame(data).set_index('date')
    return data


def stock_exists(symbol):
    if (db.hist.find_one({"symbol": symbol})):
        return True
    return False


def save_stock(data):
    db.hist.insert(data)


def get_max_date(data):
    dates = []
    for d in data:
        dates.append(parser.parse(d['date']).date())
    return max(dates)


def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + 'Z'
