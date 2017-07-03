const
    Colors = require('../lib/data/colors'),
    Utils = require('../lib/rtf-utils')
;

describe('rtf-utils', () => {

    it('getColorPosition found existing item', () => {
        const
            testTable = [
                Colors.BLACK,
                Colors.WHITE,
                Colors.RED,
            ],
            testIndex = Utils.getColorPosition(testTable, Colors.WHITE)
        ;
        testIndex.should.be.eql(1);
    });

    it('getColorPosition not found ', () => {
        const
            testTable = [
                Colors.RED,
            ],
            testIndex = Utils.getColorPosition(testTable, Colors.GREEN)
        ;
        testIndex.should.be.eql(-1);
    });

    it('getColorPosition not found in empty/null table', () => {
        const
            testIndex = Utils.getColorPosition(null, Colors.GREEN)
        ;
        testIndex.should.be.eql(-1);
    });

    it('mm2twips: 210mm = 11905twips', () => {
        const
            twips = Utils.mm2twips(210)
        ;
        twips.should.be.eql(11905);
    });


});


