module ("Basic Sanity Tests");
test( "jQuery Equality", function() {
    ok( $ === jQuery, "$ is equal to jQuery" );
    equal( 1, "1", "Passed!" );
});
test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});
