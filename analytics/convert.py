
for email in coll.distinct('email'):
    for entry in coll.find({'email': email}):
        try:
            c = json.loads(entry['content'])
            coll.update({'_id': entry['_id']}, {'$set': {'content': c}})
        except Exception as e:
            print e
            continue

