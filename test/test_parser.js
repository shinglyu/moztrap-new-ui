var expect = chai.expect;

describe('Parser', function(){
  describe('codegen', function(){
    it('build query url', function(){
      url="http://moztrap.com/api/v1/caseversion/";
      var qss = ['order_by=modified_on', 'product="Firefox OS"'];
      var url = buildQueryUrl(url, qss);
      expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?&order_by=modified_on&product=\"Firefox OS\"");
      //expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?order_by=modified_on&product=\"Firefox OS\"");
    });

    it('parse basic query into tokens', function(){
      var query = "product:\"Firefox OS\" suite:Test hello";
      var result = parseQuery(query);
      var expected = [{key:"product", value:"\"Firefox OS\""}, {key:"suite", value:"Test"}, {key:"", value:"hello"}];
      //expect(result.length).to.be.equal(expected.length);

      expect(result).to.be.eql(expected);
    });

    it('Turn tokens into TastyPie search queries', function(){
      var query = [{key:"", value:"hello"}]
      var result = queryCodegen(query);
      expect(result).to.be.eql(["name__icontains=hello"])
    });
  });
});

