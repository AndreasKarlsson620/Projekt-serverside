const { MongoClient, ObjectID } = require('mongodb')

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'boatshop';
const collectionName = 'bdb.boats';

function getAllBoats(callback)
{
	get({}, callback)
}

function getBoat(id, callback)
{
	get({ _id: new ObjectID(id) }, array => callback( array[0] ))
}

function deleteBoat(id, callback)
{
	deleteItem({ _id: new ObjectID(id) }, deletedBoat => callback( deletedBoat ))
}

function get(filter, callback)
{
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) =>
		{
			if( error )
			{
				callback('"ERROR!! Could not connect"');
				return;  // exit the callback function
			}
			const col = client.db(dbName).collection(collectionName);
			try
			{
				const cursor = await col.find(filter);
				const array = await cursor.toArray()
				callback(array);
			}
			catch(error)
			{
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');
			}
			finally
			{
				client.close();
			}
		}// connect callback - async
	)//connect - async
}

//ADD BOAT
function addBoat(requestBody, callback)
{
	// console.log('addBoat', requestBody);
	const doc = requestBody
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) =>
		{
			if( error )
			{
				callback('"ERROR!! Could not connect"');
				return;  // exit the callback function
			}
			const col = client.db(dbName).collection(collectionName);
			try
			{
				// Wait for the resut of the query
				// If it fails, it will throw an error
				const result = await col.insertOne(doc);
				callback({
					result: result.result,
					ops: result.ops
				})
			}
			catch(error)
			{
				console.error('addHat error: ' + error.message);
				callback('"ERROR!! Query error"');
			}
			finally
			{
				client.close();
			}
		}// connect callback - async
	)//connect - async
}

//DELETE BOAT
function deleteItem(filter, callback)
{
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) =>
		{
			if( error )
			{
				callback('"ERROR!! Could not connect"');
				return;  // exit the callback function
			}
			const col = client.db(dbName).collection(collectionName);
			try
			{
				const deletedBoat = await col.deleteOne(filter);
				callback(deletedBoat);
			}
			catch(error)
			{
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');
			}
			finally
			{
				client.close();
			}
		}// connect callback - async
	)//connect - async
}

//UPDATE BOAT

//SEARCH
function search(query, callback)
{
	const filter = {};
	const sortFilter = {};

	//word
	if( query.word )
	{
		filter.name = { "$regex": `.*${query.word}.*`};
	}

	//maxprice
	if( query.maxprice )
	{
		const maxPrice = Number(query.maxprice)
		filter.price = { $lte: maxPrice };
	}

	//is_sail
	if( query.is_sail )
	{
		if( query.is_sail == "yes" )
		{
			filter.sail = true;
		}
		else
		{
			filter.sail = false;
		}
	}

	//has_motor
	if( query.has_motor )
	{
		if( query.has_motor == "yes" )
		{
			filter.motor = true;
		}
		else
		{
			filter.motor = false;
		}
	}

	//madebefore
	if( query.madebefore )
	{//db.collection.find( { price: { $gt: vlue } } )
		const madeBefore = Number(query.madebefore)
		filter.year = { $lt: madeBefore };
	}

	//madeafter
	if( query.madeafter )
	{
		const madeAfter = Number(query.madeafter)
		filter.year = { $gt: madeAfter };
	}

	//order
	if(query.order)
	{
		if(query.order == "lowprice")
		{
			sortFilter.price = 1;
		}
		if(query.order == "name_asc")
		{
			sortFilter.name = 1;
		}
		if(query.order == "name_desc")
		{
			sortFilter.name = -1;
		}
		if(query.order == "oldest")
		{
			sortFilter.year = 1;
		}
		if(query.order == "newest")
		{
			sortFilter.year = -1;
		}
	}

	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) =>
		{
			if( error )
			{
				callback('"ERROR!! Could not connect"');
				return;  // exit the callback function
			}
			const col = client.db(dbName).collection(collectionName);
			try
			{
				console.log("Before find: ",filter, sortFilter)
				const cursor = await col.find(filter).sort(sortFilter).limit(5);
				const array = await cursor.toArray()
				callback(array);
			}
			catch(error)
			{
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');
			}
			finally
			{
				client.close();
			}
		}// connect callback - async
	)//connect - async
}

module.exports = {
	getAllBoats, getBoat, addBoat, deleteBoat, search
}
