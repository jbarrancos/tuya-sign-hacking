function dumpJavaBytes(v) {
  var buffer = Java.array('byte', v);
  var result = "";
  if (buffer === null) {
    return "(null)";
  }
  
  for(var i = 0; i < buffer.length; ++i){
    result+= (String.fromCharCode(buffer[i]));
  }
  return result;
}


setTimeout(function() {
setImmediate(function() {
    console.log("[*] Starting TUYA script");
    Java.performNow(function() {

        // log sign requests
        var jniClass = Java.use("com.tuya.smart.security.jni.JNICLibrary");
        jniClass.doCommandNative.implementation = function(ctx, cmd, v2, v3, v4, v5) {
            var ret = this.doCommandNative(ctx, cmd, v2, v3, v4, v5);
            send("doCommandNative: cmd=" + cmd + ", v2=" + dumpJavaBytes(v2) + ", v3=" + dumpJavaBytes(v3) + ", v4=" + v4 + ", v5=" + v5 + ", ret=" + ret);
            return ret;
        };


        // log GET and POST data
        var apiParamsClass = Java.use("com.tuya.smart.android.network.TuyaApiParams");
        apiParamsClass.getRequestUrl.overload().implementation = function() {
            var res = this.getRequestUrl();
            console.log("URL: ", res);
            var postData = this.getPostDataString();
            console.log("POST: ", postData);
            return res;
        };

        console.log("[*] getRequestUrl modified");


        // log JSON responses
        var logClass = Java.use("com.tuya.smart.android.common.utils.L");
        logClass.logJson.implementation = function(tag, json) {
            console.log("JSON: ", json);
        };


        // log MD5 requests
        var md5Class = Java.use("com.tuya.smart.android.common.utils.MD5Util");
        md5Class.md5AsBase64.overload('java.lang.String').implementation = function(input) {
            console.log("MD5 in: ", input);
            var res = this.md5AsBase64(input);
            console.log("MD5 out: ", res);
            return res;
        }

        // debuggable
        // com.tuyasmart.sample.app.TuyaSmartApplication

    });
});
}, 5000);
