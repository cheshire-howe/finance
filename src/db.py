from pymongo import MongoClient

import pandas as pd
from pandas.io.data import get_data_yahoo

from datetime import datetime, timedelta
from dateutil import parser
import json

db = MongoClient('192.168.2.13', 27017).stocks


def make_current(symbol):
    today = datetime.now().date()
    weekday = datetime.today().weekday()
    if weekday is 5:
        today = today - timedelta(days=1)
    if weekday is 6:
        today = today - timedelta(days=2)
    data = get_stock(symbol)
    max_date = get_max_date(data)
    if ((today - max_date).days > 1):
        delta = (today - max_date).days - 1
        try:
            new_data = get_data_yahoo(
                symbol, datetime.now() - timedelta(days=delta))
            if new_data.empty is not True:
                print "Updated from yahoo"
                new_data = convert_pandas_to_list(new_data)
                print new_data
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
        except:
            print "Yahoo error"
            pass


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


def get_stock(symbol):
    data = db.hist.find_one({"symbol": symbol})['data']
    return data


def get_stock_json(symbol, days):
    data = get_stock(symbol)
    js_data = [d for d in data if d['date']
               >= datetime.now() - timedelta(days=int(days))]
    data = json.dumps(js_data, default=json_serial)
    return data


def get_stock_pandas(symbol):
    data = get_stock(symbol)
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
        dates.append(d['date'])
    return max(dates).date()


def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + 'Z'
