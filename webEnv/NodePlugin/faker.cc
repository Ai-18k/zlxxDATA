#include <node.h>

namespace faker {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Value;
using v8::Context;
using v8::FunctionTemplate;
using v8::Array;
using v8::String;
using v8::Maybe;

static void ReturnThis(const FunctionCallbackInfo<Value>& args) {
  args.GetReturnValue().Set(args.This());
}

void DocumentAll(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    Local<FunctionTemplate> desc = FunctionTemplate::New(isolate);
    desc->InstanceTemplate()->MarkAsUndetectable();
    desc->InstanceTemplate()->SetCallAsFunctionHandler(ReturnThis);

    Local<Object> obj = desc->GetFunction(context).ToLocalChecked()
                            ->NewInstance(context).ToLocalChecked();

    Local<Array> arr = Local<Array>::Cast(args[0]);
    for (uint32_t i = 0; i < arr->Length(); i++) {
        Local<Value> value = arr->Get(context, i).ToLocalChecked();
        Local<String> key = String::NewFromUtf8(isolate, std::to_string(i).c_str()).ToLocalChecked();

        // 处理 Set() 的返回值，避免警告
        Maybe<bool> result = obj->Set(context, key, value);
        if (result.IsNothing()) {
          isolate->ThrowException(v8::Exception::Error(
            String::NewFromUtf8(isolate, "Failed to set property").ToLocalChecked()
          ));
          return;
        }
    }

    args.GetReturnValue().Set(obj);
}


void Initialize(Local<Object> exports, Local<Value> module, void* privy) {
    NODE_SET_METHOD(exports, "DocumentAll", DocumentAll);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}