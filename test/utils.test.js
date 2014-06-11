
var	assert	=	require(	'assert'	),	utils	=	require(	'../utils'	);

describe(	'testing utils.js algorithms : Array.prototype.hasValue and utils.parseDate( inputstr, dateformat )',	function()	{
	describe(	'Array',	function()	{
		describe(	'.prototype.hasValue',	function()	{
			it(	'should return true when the value is in the Array',	function()	{
				assert(	[	1,	2,	3	].hasValue(	1	)	);
				assert(	new	Array(	1,	2,	3	).hasValue(	1	)	);
				assert(	[	1,	2,	3	].hasValue(	2	)	);
				assert(	new	Array(	1,	2,	3	).hasValue(	2	)	);
				assert(	[	1,	2,	3	].hasValue(	3	)	);
				assert(	new	Array(	1,	2,	3	).hasValue(	3	)	);
			}	);
			it(	'should return false when the value is not in the Array',	function()	{
				assert(	![	1,	2,	3	].hasValue(	4	)	);
				assert(	!new	Array(	1,	2,	3	).hasValue(	4	)	);
				assert(	![	1,	2,	3	].hasValue(	0	)	);
				assert(	!new	Array(	1,	2,	3	).hasValue(	0	)	);
			}	);
		}	);
	}	);
	describe(	'Global	util	functions',	function()	{
		describe(	'utils.parseDate',	function()	{
			describe(	'fullmonthtext',	function()	{
				it(	'should return "" fullmonthtext string for month input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-0-2	3h	4min	5s',	'_M'	).fullmonthtext,	''	);
					assert.equal(	utils.parseDate(	'1-00000000000000000-2	3h	4min	5s',	'_M'	).fullmonthtext,	''	);
				}	);
				it(	'should return "" fullmonthtext string for any month input > 12',	function()	{
					assert.equal(	utils.parseDate(	'6-142-2	3h	4min	5s',	'_M'	).fullmonthtext,	''	);
					assert.equal(	utils.parseDate(	'6-000015-2	3h	4min	5s',	'_M'	).fullmonthtext,	''	);
					assert.equal(	utils.parseDate(	'6-5459-2	3h	4min	5s',	'_M'	).fullmonthtext,	''	);
				}	);
				it(	'should return the correct fullmonthtext string ( "April" ) for month input in range [ 1, 12 ] ( 4 )',	function()	{
					assert.equal(	utils.parseDate(	'1-4-2	3h	4min	5s',	'_M'	).fullmonthtext,	'April'	);
				}	);
				it(	'should return the correct fullmonthtext string ( "March" ) for month input in range [ 1, 12 ] filled with 0 ( 0003 )',	function()	{
					assert.equal(	utils.parseDate(	'8-0003-4	5h	6min	7s',	'_M'	).fullmonthtext,	'March'	);
				}	);
			}	);
			describe(	'fullyear',	function()	{
				it(	'should return "0000" fullyear string for year input 0',	function()	{
					assert.equal(	utils.parseDate(	'0-1-2	3h	4min	5s',	'Y'	).fullyear,	'0000'	);
				}	);
				it(	'should return "0123" fullyear string for year input 123',	function()	{
					assert.equal(	utils.parseDate(	'123-4-5	6h	7min	8s',	'Y'	).fullyear,	'0123'	);
				}	);
				it(	'should return "12345" fullyear string for year input 12345',	function()	{
					assert.equal(	utils.parseDate(	'12345-6-7	8h	9min	0s',	'Y'	).fullyear,	'12345'	);
				}	);
				it(	'should return "00012" fullyear string for year input 00012',	function()	{
					assert.equal(	utils.parseDate(	'00012-3-4	5h	6min	7s',	'Y'	).fullyear,	'00012'	);
				}	);
			}	);
			describe(	'fullmonth',	function()	{
				it(	'should return "00" fullmonth string for month input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-0-2	3h	4min	5s',	'_M'	).fullmonth,	'00'	);
				}	);
				it(	'should return "01" fullmonth string for month input 1',	function()	{
					assert.equal(	utils.parseDate(	'6-1-2	3h	4min	5s',	'_M'	).fullmonth,	'01'	);
				}	);
				it(	'should return "123" fullmonth string for month input 123',	function()	{
					assert.equal(	utils.parseDate(	'8-123-4	5h	6min	7s',	'_M'	).fullmonth,	'123'	);
				}	);
				it(	'should return "012" fullmonth string for month input 012',	function()	{
					assert.equal(	utils.parseDate(	'1-012-2	3h	4min	5s',	'_M'	).fullmonth,	'012'	);
				}	);
			}	);
			describe(	'fullday',	function()	{
				it(	'should return "00" fullday string for day input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-2-0	3h	4min	5s',	'-_D'	).fullday,	'00'	);
				}	);
				it(	'should return "01" fullday string for day input 1',	function()	{
					assert.equal(	utils.parseDate(	'6-2-1	3h	4min	5s',	'-_D'	).fullday,	'01'	);
				}	);
				it(	'should return "123" fullday string for day input 123',	function()	{
					assert.equal(	utils.parseDate(	'8-4-123	5h	6min	7s',	'-_D'	).fullday,	'123'	);
				}	);
				it(	'should return "012" fullday string for day input 012',	function()	{
					assert.equal(	utils.parseDate(	'1-2-012	3h	4min	5s',	'-_D'	).fullday,	'012'	);
				}	);
			}	);
			describe(	'fullhour',	function()	{
				it(	'should return "00" fullhour string for hour input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	0h	4min	5s',	'_-_H'	).fullhour,	'00'	);
				}	);
				it(	'should return "01" fullhour string for hour input 1',	function()	{
					assert.equal(	utils.parseDate(	'6-2-3	1h	4min	5s',	'_-_H'	).fullhour,	'01'	);
				}	);
				it(	'should return "123" fullhour string for hour input 123',	function()	{
					assert.equal(	utils.parseDate(	'8-4-5	123h	6min	7s',	'_-_H'	).fullhour,	'123'	);
				}	);
				it(	'should return "012" fullhour string for hour input 012',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	012h	4min	5s',	'_-_H'	).fullhour,	'012'	);
				}	);
			}	);
			describe(	'fullminute',	function()	{
				it(	'should return "00" fullminute string for minute input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	0min	5s',	'-_-_I'	).fullminute,	'00'	);
				}	);
				it(	'should return "01" fullminute string for minute input 1',	function()	{
					assert.equal(	utils.parseDate(	'6-2-3	4h	1min	5s',	'-_-_I'	).fullminute,	'01'	);
				}	);
				it(	'should return "123" fullminute string for minute input 123',	function()	{
					assert.equal(	utils.parseDate(	'8-4-5	6h	123min	7s',	'-_-_I'	).fullminute,	'123'	);
				}	);
				it(	'should return "012" fullminute string for minute input 012',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	012min	5s',	'-_-_I'	).fullminute,	'012'	);
				}	);
			}	);
			describe(	'fullsecond',	function()	{
				it(	'should return "00" fullsecond string for second input 0',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	0s',	'_-_-_S'	).fullsecond,	'00'	);
				}	);
				it(	'should return "01" fullsecond string for second input 1',	function()	{
					assert.equal(	utils.parseDate(	'6-2-3	4h	5min	1s',	'_-_-_S'	).fullsecond,	'01'	);
				}	);
				it(	'should return "123" fullsecond string for second input 123',	function()	{
					assert.equal(	utils.parseDate(	'8-4-5	6h	7min	123s',	'_-_-_S'	).fullsecond,	'123'	);
				}	);
				it(	'should return "012" fullsecond string for second input 012',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	012s',	'_-_-_S'	).fullsecond,	'012'	);
				}	);
			}	);
			describe(	'second',	function()	{
				it(	'should return 0 second number for second input 00',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	00s',	'_-_-_S'	).second,	0	);
				}	);
				it(	'should return 1 second number for second input 01',	function()	{
					assert.equal(	utils.parseDate(	'6-2-3	4h	5min	01s',	'_-_-_S'	).second,	1	);
				}	);
				it(	'should return 0 second number for second input 0',	function()	{
					assert.equal(	utils.parseDate(	'8-4-5	6h	7min	0s',	'_-_-_S'	).second,	0	);
				}	);
				it(	'should return 1 second number for second input 1',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	1s',	'_-_-_S'	).second,	1	);
				}	);
				it(	'should return 12345 second number for second input 12345',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	12345s',	'_-_-_S'	).second,	12345	);
				}	);
			}	);
			describe(	'year',	function()	{
				it(	'should return 0 year number for second input 0000',	function()	{
					assert.equal(	utils.parseDate(	'0000-2-3	4h	5min	9s',	'Y'	).year,	0	);
				}	);
				it(	'should return 12 year number for second input 0012',	function()	{
					assert.equal(	utils.parseDate(	'0012-2-3	4h	5min	9s',	'Y'	).year,	12	);
				}	);
				it(	'should return 0 year number for second input 0',	function()	{
					assert.equal(	utils.parseDate(	'0-4-5	6h	7min	9s',	'Y'	).year,	0	);
				}	);
				it(	'should return 1 year number for second input 1',	function()	{
					assert.equal(	utils.parseDate(	'1-2-3	4h	5min	15s',	'Y'	).year,	1	);
				}	);
				it(	'should return 12345 year number for second input 12345',	function()	{
					assert.equal(	utils.parseDate(	'12345-2-3	4h	5min	45s',	'Y'	).year,	12345	);
				}	);
			}	);
		}	);
	}	);
}	);
