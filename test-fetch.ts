const testFetch = async () => {
    try {
        const res = await fetch('https://kurdkids.ir/wp-json/');
        console.log(res.status);
    } catch(e) {
        console.error(e);
    }
}
testFetch();
