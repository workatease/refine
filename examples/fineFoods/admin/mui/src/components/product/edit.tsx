import React from "react";
import axios from "axios";

import { useTranslate, useApiUrl } from "@pankod/refine-core";

import {
    FieldValues,
    UseFormRegister,
    UseFormHandleSubmit,
    UseFormSetValue,
    UseFormWatch,
    Controller,
    Control,
} from "@pankod/refine-react-hook-form";

import {
    Drawer,
    FormControlLabel,
    Input,
    Radio,
    RadioGroup,
    TextField,
    Avatar,
    Typography,
    FormLabel,
    Stack,
    useTheme,
    Box,
    IconButton,
    FormControl,
    useAutocomplete,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    Autocomplete,
    Edit,
    SaveButtonProps,
} from "@pankod/refine-mui";

import CloseIcon from "@mui/icons-material/Close";

import { ICategory } from "interfaces";

type EditProductProps = {
    visible: boolean;
    close: () => void;
    register: UseFormRegister<FieldValues>;
    handleSubmit: UseFormHandleSubmit<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    errors: { [x: string]: any };
    watch: UseFormWatch<FieldValues>;
    onFinish: (values: FieldValues) => Promise<void>;
    control: Control<FieldValues>;
    saveButtonProps: SaveButtonProps;
};

export const EditProduct: React.FC<EditProductProps> = ({
    visible,
    close,
    register,
    handleSubmit,
    setValue,
    errors,
    watch,
    onFinish,
    control,
    saveButtonProps,
}) => {
    const t = useTranslate();

    const theme = useTheme();

    const apiUrl = useApiUrl();

    const { autocompleteProps } = useAutocomplete<ICategory>({
        resource: "categories",
    });

    const imageInput = watch("images");

    const onChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const formData = new FormData();

        const target = event.target;
        const file: File = (target.files as FileList)[0];

        formData.append("file", file);

        const res = await axios.post<{ url: string }>(
            `${apiUrl}/media/upload`,
            formData,
            {
                withCredentials: false,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        const { name, size, type, lastModified } = file;

        const imagePaylod = [
            {
                name,
                size,
                type,
                lastModified,
                url: res.data.url,
            },
        ];

        setValue("images", imagePaylod, { shouldValidate: true });
    };

    return (
        <Drawer
            sx={{
                "& .MuiDrawer-paper": {
                    [theme.breakpoints.down("sm")]: {
                        width: " 100%",
                    },
                    width: "500px",
                },
            }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Edit
                saveButtonProps={saveButtonProps}
                cardHeaderProps={{
                    avatar: (
                        <IconButton
                            onClick={() => close()}
                            sx={{ width: "30px", height: "30px", mb: "5px" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ),
                    action: null,
                }}
                cardProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
            >
                <Stack>
                    <Box
                        paddingX="50px"
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="50px"
                    >
                        <form onSubmit={handleSubmit(onFinish)}>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel required>
                                    {t("products.fields.images.label")}
                                </FormLabel>
                                <Stack
                                    display="flex"
                                    alignItems="center"
                                    border="1px dashed  "
                                    borderColor="primary.main"
                                    borderRadius="5px"
                                    padding="10px"
                                    marginTop="5px"
                                    sx={{
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <label htmlFor="images-input">
                                        <Input
                                            id="images-input"
                                            type="file"
                                            sx={{
                                                display: "none",
                                            }}
                                            onChange={onChangeHandler}
                                        />
                                        <input
                                            id="file"
                                            {...register("images", {
                                                required: "Image ",
                                            })}
                                            type="hidden"
                                        />
                                        <Avatar
                                            sx={{
                                                cursor: "pointer",
                                                width: "200px",
                                                height: "200px",
                                            }}
                                            src={
                                                imageInput && imageInput[0].url
                                            }
                                            alt="Store Location"
                                        />
                                    </label>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: "16px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        {t(
                                            "products.fields.images.description",
                                        )}
                                    </Typography>
                                    <Typography style={{ fontSize: "12px" }}>
                                        {t("products.fields.images.validation")}
                                    </Typography>
                                </Stack>
                                {errors.images && (
                                    <FormHelperText error>
                                        {errors.images.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack gap="10px" marginTop="10px">
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.name")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="name"
                                        {...register("name", {
                                            required: "Name required",
                                        })}
                                        style={{ height: "40px" }}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.description")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="description"
                                        {...register("description", {
                                            required: "Description required",
                                        })}
                                        multiline
                                        maxRows={5}
                                    />
                                    {errors.description && (
                                        <FormHelperText error>
                                            {errors.description.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.price")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="price"
                                        {...register("price", {
                                            required: "Price required",
                                        })}
                                        style={{
                                            width: "150px",
                                            height: "40px",
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        }
                                    />
                                    {errors.price && (
                                        <FormHelperText error>
                                            {errors.price.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <Controller
                                    control={control}
                                    name="category"
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...autocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.title
                                                    ? item.title
                                                    : "";
                                            }}
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) =>
                                                value === undefined ||
                                                option.id === value.id
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Category"
                                                    margin="normal"
                                                    variant="outlined"
                                                    error={!!errors.item}
                                                    helperText={
                                                        errors.item &&
                                                        "Categoty required"
                                                    }
                                                    required
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <FormControl>
                                    <FormLabel
                                        sx={{ marginTop: "10px" }}
                                        required
                                    >
                                        {t("products.fields.isActive")}
                                    </FormLabel>
                                    <Controller
                                        control={control}
                                        name="isActive"
                                        defaultValue={""}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <RadioGroup
                                                id="isActive"
                                                {...field}
                                                row
                                            >
                                                <FormControlLabel
                                                    value={true}
                                                    control={<Radio />}
                                                    label={t("status.enable")}
                                                />
                                                <FormControlLabel
                                                    value={false}
                                                    control={<Radio />}
                                                    label={t("status.disable")}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.isActive && (
                                        <FormHelperText error>
                                            {errors.isActive.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};