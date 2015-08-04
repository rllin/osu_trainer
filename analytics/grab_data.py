import pymongo

#client = pymongo.MongoClient('ec2-52-25-109-156.us-west-2.compute.amazonaws.com:27017')
#coll = client.target['targets']

class DataException(Exception):
    pass


class Participant:
    def __init__(self, bio, coll):
        self.coll = coll
        self.email = bio['email']
        self.rounds = ['round 1', 'round 2', 'round 3']
        self.bio, self.inits, self.cursors = bio, self.grab_inits(), self.grab_cursors()
        try:
            self.rank = int(''.join(self.bio['content']['rank'].split(',')))
        except:
            raise DataException('Rank not parseable integer')
        self.section_cursors = self.grab_section_cursors()
        print self.bio['email']
    

    def grab_inits(self):
        return list(self.coll.find({'email': self.email, 'state': 'initialize'}).sort('timestamp', pymongo.ASCENDING))

    def grab_cursors(self):
        return list(self.coll.find({'email': self.email, 'state': 'hit'}).sort('timestamp', pymongo.ASCENDING))

    def grab_section_cursors(self):
        result = {}
        i = 0 
        for section in self.inits:
            result[section['content']['task mode']] = [e['content'] for e in self.cursors[i:i+len(section['content']['combos'])]]
            i += len(section['content']['combos'])
        return result

    def time_to_clicks(self):
        '''  from appearance to successful click '''
        results = []
        for section in self.rounds:
            cursors = self.section_cursors[section]
            for cur in cursors:
                times, event, x, y = zip(*cur['mouseCoor'])
                results.append(times[-1] - cur['target'][0])
        return results


class Study:
    def __init__(self, mongo_url, database, collection, game, limit=100):
        self.mongo_url, self.database, self.collection, self.game, self.limit = mongo_url, database, collection, game, limit
        self.coll = pymongo.MongoClient(mongo_url)[database][collection]
        self.emails = self.grab_emails()
        self.participants = self.parse_participants()
        #self.participants = dict(zip(self.emails, [Participant(self.grab_bio(e), self.coll) for e in self.emails]))
   
    def parse_participants(self):
        result = {}
        for e in self.emails:
            try:
                result[e] = Participant(self.grab_bio(e), self.coll)
            except DataException as err:
                print err
                continue
        self.emails = result.keys()
        return result


    def grab_emails(self):
        emails = [e['_id'] for e in self.coll.aggregate([ {'$group': {'_id': '$email', 'count': {'$sum': 1}}}, {'$limit': self.limit}, {'$match': {'count': 154}}])]
        emails = [e['email'] for e in self.coll.find({'state': 'bio', 'content.game': self.game}) if e['email'] in emails]
        return emails

    def grab_bio(self, email):
        try:
            self.coll.find({'email': email, 'state': 'bio'})[0]
        except:
            print email
        return self.coll.find({'email': email, 'state': 'bio'})[0]



