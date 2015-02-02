from pandas.io.data import get_data_yahoo
from datetime import datetime, timedelta
import db


def get_quotes(symbol, days):
    if (db.stock_exists(symbol)):
        data = db.get_stock_json(symbol, days)
        db.make_current(symbol, data)
        print "Data from db"
    else:
        data = get_data_yahoo(symbol, datetime.now() - timedelta(days=3000))
        data = db.convert_pandas_to_list(data)
        temp = {"symbol": symbol, "data": data}
        db.save_stock(temp)
        data = db.get_stock_json(symbol, days)
        print "Data from Yahoo"
    return data
