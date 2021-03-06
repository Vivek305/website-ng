## Op
```python
Op(inputs:Union[NoneType, str, Iterable[str], Callable]=None, outputs:Union[NoneType, str, Iterable[str]]=None, mode:Union[NoneType, str, Iterable[str]]=None) -> None
```
A base class for FastEstimator Operators.

Operators are modular pieces of code which can be used to build complex execution graphs. They are based on three
main variables: `inputs`, `outputs`, and `mode`. When FastEstimator executes, it holds all of its available data
behind the scenes in a data dictionary. If an `Op` wants to interact with a piece of data from this dictionary, it
lists the data's key as one of it's `inputs`. That data will then be passed to the `Op` when the `Op`s forward
function is invoked (see NumpyOp and TensorOp for more information about the forward function). If an `Op` wants to
write data into the data dictionary, it can return values from its forward function. These values are then written
into the data dictionary under the keys specified by the `Op`s `outputs`. An `Op` will only be run if its associated
`mode` matches the current execution mode. For example, if an `Op` has a mode of 'eval' but FastEstimator is
currently running in the 'train' mode, then the `Op`s forward function will not be called.

Normally, if a single string "key" is passed as `inputs` then the value that is passed to the forward function will
be the value exactly as it is stored in the data dictionary: dict["key"]. On the other hand, if ["key"] is passed as
`inputs` then the value passed to the forward function will be the element stored in the data dictionary, but
wrapped within a list: [dict["key"]]. This can be inconvenient in some cases where an `Op` is anticipated to take
one or more inputs and treat them all in the same way. In such cases the `in_list` member variable may be manually
overridden to True. This will cause data to always be sent to the forward function like [dict["key"]] regardless of
whether `inputs` was a single string or a list of strings. For an example of when this is useful, see:
fe.op.numpyop.univariate.univariate.ImageOnlyAlbumentation.

Similarly, by default, if an `Op` has a single `output` string "key" then that output R will be written into the
data dictionary exactly as it is presented: dict["key"] = R. If, however, ["key"] is given as `outputs` then the
return value for R from the `Op` is expected to be a list [X], where the inner value will be written to the data
dictionary: dict["key"] = X. This can be inconvenient in some cases where an `Op` wants to always return data in a
list format without worrying about whether it had one input or more than one input. In such cases the `out_list`
member variable may be manually overridden to True. This will cause the system to always assume that the response is
in list format and unwrap the values before storing them into the data dictionary. For an example, see:
fe.op.numpyop.univariate.univariate.ImageOnlyAlbumentation.


#### Args:

* **inputs** :  Key(s) from which to retrieve data from the data dictionary.
* **outputs** :  Key(s) under which to write the outputs of this Op back to the data dictionary.
* **mode** :  What mode(s) to execute this Op in. For example, "train", "eval", "test", or "infer". To execute        regardless of mode, pass None. To execute in all modes except for a particular one, you can pass an argument        like "!infer" or "!train".